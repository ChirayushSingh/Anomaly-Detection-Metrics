import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score, recall_score, f1_score
from joblib import Parallel, delayed
import logging
import os
import time

# Configure paths (update these to your actual data location)
INPATH = 'C:\\Users\\India\\OneDrive\\Desktop\\Anomaly_Detection\\'
OUTPATH = 'C:\\Users\\India\\OneDrive\\Desktop\\Anomaly_Detection\\'

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def time_step(step_name, start_time):
    elapsed = time.time() - start_time
    logging.info(f"{step_name} took {elapsed:.2f} seconds")
    return time.time()


def inject_synthetic_anomalies(df, numerical_columns, anomaly_rate=0.05):
    true_labels = {col: np.ones(len(df), dtype=int) for col in numerical_columns}
    anomaly_indices = np.random.choice(df.index, int(len(df) * anomaly_rate), replace=False)
    for col in numerical_columns:
        noise = np.random.normal(5 * df[col].std(), 0.5 * df[col].std(), size=len(anomaly_indices))
        df.loc[anomaly_indices, col] += noise
        true_labels[col][anomaly_indices] = -1
    return true_labels


def process_cell(cell_name, cell_data, true_labels, numerical_columns, param_grid):
    cell_data = cell_data.sort_values('Date')
    cell_anomalies = {}
    local_params = {}
    for col in numerical_columns:
        X = cell_data[[col]]
        X_scaled = StandardScaler().fit_transform(X)
        best_f1, best_result = -1, None
        for n_est in param_grid['n_estimators']:
            for cont in param_grid['contamination']:
                model = IsolationForest(n_estimators=n_est, contamination=cont, random_state=42)
                pred = model.fit_predict(X_scaled)
                # Align indices for true labels
                true = true_labels[col][cell_data.index]
                f1 = f1_score(true, pred, pos_label=-1, zero_division=0)
                if f1 > best_f1:
                    best_f1, best_result = f1, pred
                    local_params[(cell_name, col)] = {'n_estimators': n_est, 'contamination': cont}
        cell_anomalies[col] = best_result
    return cell_name, cell_anomalies, local_params


def doProcess(INPATH, OUTPATH):
    overall_start = time.time()

    if not INPATH.endswith(os.sep): INPATH += os.sep
    if not OUTPATH.endswith(os.sep): OUTPATH += os.sep

    # Step 1: Load data
    try:
        df = pd.read_parquet(INPATH + 'Daily_NR_KPI.parquet')
        logging.info("Data loaded successfully.")
    except Exception as e:
        logging.error(f"Error loading data: {e}")
        return

    # Step 2: Preprocess
    df['Date'] = pd.to_datetime(df['Date'], format="%Y-%m-%d", errors='coerce')
    numerical_columns = df.select_dtypes(include=['float64', 'int64']).columns.tolist()
    # Remove non-KPI columns from numerical_columns
    for col in ['Cell_Name', 'Date']:
        if col in numerical_columns:
            numerical_columns.remove(col)
    df[numerical_columns] = df[numerical_columns].apply(pd.to_numeric, errors='coerce')
    df[numerical_columns] = df[numerical_columns].astype(float).fillna(df[numerical_columns].mean())

    # Step 3: Inject Anomalies
    true_labels = inject_synthetic_anomalies(df, numerical_columns)

    # Step 4: Cell-Level Anomaly Detection
    if 'Cell_Name' not in df.columns:
        logging.error("Column 'Cell_Name' not found in data.")
        return
    grouped_data = list(df.groupby('Cell_Name'))
    param_grid = {'n_estimators': [100], 'contamination': [0.05]}

    results = Parallel(n_jobs=-1)(
        delayed(process_cell)(cell_name, group.copy(), true_labels, numerical_columns, param_grid)
        for cell_name, group in grouped_data
    )

    # Step 5: Collect and Append Anomalies
    anomaly_results, best_params = {}, {}
    for cell_name, anomalies, params in results:
        anomaly_results[cell_name] = anomalies
        best_params.update(params)

    for col in numerical_columns:
        df[f'{col}_anomaly'] = 1

    for cell_name, anomalies in anomaly_results.items():
        for col, pred in anomalies.items():
            # Ensure pred is not None
            if pred is not None:
                df.loc[df['Cell_Name'] == cell_name, f'{col}_anomaly'] = pred

    # Step 6: RCA Mapping
    rca_mapping = {
        'Average ENDC User DL Throughpu(Mbps)': [
            'PATHLOSS', 'Average CQI ( 256 QAM)', 'Cell Availability',
            'DL BLER (%)  -  gNB', 'UL RSSI (dBm/PRB)  -  gNB',
            'Avg. Overall DL Latency (ms)  -  gNB',
            'DL RBSym Utilization (per resource partition is also ok since 1PLMN=1partition)',
            'NR_DL_256QAM', 'NR_DL_64QAM', 'NR_DL_16QAM', 'NR_DL_QPSK',
            'Maximum number of RRC Connected Users in NSA dual connectivity',
            'Active_Users', 'Total_Traffic_Vol_GB', 'MIMO Utilisation'
        ]
    }

    for target_kpi, sources in rca_mapping.items():
        source_anomaly_cols = [f"{src}_anomaly" for src in sources if f"{src}_anomaly" in df.columns]
        if f"{target_kpi}_anomaly" not in df.columns:
            continue
        df[f'{target_kpi}_RCA_Remark'] = df[source_anomaly_cols].eq(-1).apply(
            lambda row: (
                f"{target_kpi} is impacted due to {', '.join([col for col, val in zip(source_anomaly_cols, row) if val == -1])}"
                if row.any() else f"{target_kpi} has an anomaly but no significant RCA found"
            ), axis=1
        ).where(df[f"{target_kpi}_anomaly"] == -1, '')

    # Step 7: Save Results
    try:
        df.to_csv(OUTPATH + 'OutPut_Daily_NR_KPI.csv', index=False)
    except Exception as e:
        logging.error(f"Error saving output CSV: {e}")

    # Step 8: Metrics Aggregation
    metrics = {}
    for col in numerical_columns:
        y_true, y_pred = [], []
        for cell_name, group in grouped_data:
            true = true_labels[col][group.index]
            pred = df.loc[group.index, f'{col}_anomaly'].values
            y_true.extend(true)
            y_pred.extend(pred)
        metrics[col] = {
            'Precision': precision_score(y_true, y_pred, pos_label=-1, zero_division=0),
            'Recall': recall_score(y_true, y_pred, pos_label=-1, zero_division=0),
            'F1-Score': f1_score(y_true, y_pred, pos_label=-1, zero_division=0)
        }

    try:
        pd.DataFrame.from_dict(metrics, orient='index').reset_index().rename(columns={'index': 'KPI'}).to_csv(
            OUTPATH + 'Anomaly_Detection_Metrics.csv', index=False)
    except Exception as e:
        logging.error(f"Error saving metrics CSV: {e}")

    logging.info(f"Total time taken: {time.time() - overall_start:.2f} seconds")


doProcess(INPATH, OUTPATH)

