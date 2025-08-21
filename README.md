# Anomaly Detection Metrics

A modern, responsive web dashboard for visualizing anomaly detection performance metrics across various KPIs (Key Performance Indicators). Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Interactive Metrics Visualization**: Beautiful cards displaying precision, recall, and F1-scores for each KPI
- **Real-time Search & Filtering**: Search through KPIs and sort by different metrics
- **Performance Analytics**: Summary statistics and comparative charts
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and transitions
- **Preview Project Link**: https://stackblitz.com/~/github.com/ChirayushSingh/Anomaly-Detection-Metrics

## 📊 Metrics Displayed

The dashboard analyzes the following telecommunications KPIs:

- Cell Availability
- Average ENDC User DL Throughput
- Total Traffic Volume
- DL RBSym Utilization
- DL BLER (Block Error Rate)
- Active Users
- RRC Connected Users
- DL Latency
- Average CQI
- Path Loss
- UL RSSI
- Various QAM metrics (256QAM, 64QAM, 16QAM, QPSK)
- MIMO Utilization

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Format**: CSV parsing for metrics data

## 📁 Project Structure

```
src/
├── components/
│   ├── MetricsCard.tsx      # Individual KPI metric cards
│   ├── SummaryStats.tsx     # Overall statistics summary
│   ├── MetricsChart.tsx     # Performance comparison charts
│   └── SearchFilter.tsx     # Search and sorting controls
├── hooks/
│   └── useMetricsData.ts    # Data fetching and management
├── utils/
│   └── metricsCalculations.ts # Statistical calculations
└── App.tsx                  # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd anomaly-detection-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Place your metrics data:
   - Ensure your `Anomaly_Detection_Metrics.csv` file is in the `public/data/` directory
   - The CSV should have columns: KPI, Precision, Recall, F1-Score

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📈 Data Format

The dashboard expects a CSV file with the following structure:

```csv
KPI,Precision,Recall,F1-Score
Cell Availability,0.9258,0.6715,0.7784
Average ENDC User DL Throughpu(Mbps),0.5784,0.6783,0.6244
...
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` to customize the color scheme
- Update component styles in individual `.tsx` files
- Add custom CSS in `src/index.css`

### Metrics
- Update the data parsing logic in `useMetricsData.ts`
- Modify calculation functions in `metricsCalculations.ts`
- Customize the display format in component files

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Performance Metrics

The dashboard calculates and displays:
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **Summary Statistics**: Averages across all KPIs
- **Rankings**: Performance-based KPI rankings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React patterns and TypeScript
- Styled with Tailwind CSS for rapid development
- Icons provided by Lucide React
- Optimized for performance and accessibility

## 📞 Support

For questions or support, please open an issue in the GitHub repository or contact the development team.

## 🎨 Preview Project Link :- https://stackblitz.com/~/github.com/ChirayushSingh/Anomaly-Detection-Metrics


**Note**: This dashboard is designed for telecommunications anomaly detection metrics but can be easily adapted for other domains by modifying the data structure and KPI definitions.
