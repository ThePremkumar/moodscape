import { useState, useEffect } from "react";
import { fetchAnalytics } from "../api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="page-header">
          <h1>Mood Analytics</h1>
          <p>Crunching your emotional data...</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.total_entries === 0) {
    return (
      <div className="app-container" id="analytics-page">
        <div className="page-header">
          <h1>Mood Analytics</h1>
          <p>Visualize your emotional patterns 📊</p>
        </div>
        <div className="timeline-empty">
          <div className="empty-emoji">📊</div>
          <p>No data yet. Start logging moods to see your analytics!</p>
        </div>
      </div>
    );
  }

  const dist = analytics.distribution;
  const labels = Object.values(dist).map((d) => `${d.emoji} ${d.name}`);
  const counts = Object.values(dist).map((d) => d.count);
  const colors = Object.values(dist).map((d) => d.color);

  const doughnutData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors.map((c) => c + "CC"),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(10, 10, 26, 0.9)",
        titleFont: { family: "Outfit", size: 14 },
        bodyFont: { family: "Inter", size: 12 },
        cornerRadius: 8,
        padding: 12,
      },
    },
    cutout: "65%",
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Entries",
        data: counts,
        backgroundColor: colors.map((c) => c + "99"),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 10, 26, 0.9)",
        titleFont: { family: "Outfit", size: 14 },
        bodyFont: { family: "Inter", size: 12 },
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(240,240,248,0.4)",
          font: { family: "Inter", size: 12 },
          stepSize: 1,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      x: {
        ticks: {
          color: "rgba(240,240,248,0.65)",
          font: { family: "Inter", size: 11 },
        },
        grid: { display: false },
      },
    },
  };

  const mostFrequent = analytics.most_frequent
    ? dist[analytics.most_frequent]
    : null;

  return (
    <div className="app-container" id="analytics-page">
      <div className="page-header">
        <h1>Mood Analytics</h1>
        <p>Visualize your emotional patterns 📊</p>
      </div>

      {/* Stats Row */}
      <div className="analytics-grid">
        <div className="analytics-card glass">
          <h3>Total Entries</h3>
          <div className="stat-number">{analytics.total_entries}</div>
          <div className="stat-label">mood entries logged</div>
        </div>

        <div className="analytics-card glass">
          <h3>Most Frequent Mood</h3>
          {mostFrequent ? (
            <>
              <div className="stat-number">
                {mostFrequent.emoji} {mostFrequent.name}
              </div>
              <div className="stat-label">
                {mostFrequent.count} entries
              </div>
            </>
          ) : (
            <div className="stat-label">No data yet</div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <div className="chart-container glass">
          <h3>Mood Distribution</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>

        <div className="chart-container glass">
          <h3>Mood Frequency</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Breakdown List */}
      <div className="analytics-card glass">
        <h3>Mood Breakdown</h3>
        <div className="mood-breakdown">
          {Object.entries(dist).map(([key, val]) => (
            <div className="mood-stat-row" key={key}>
              <div
                className="mood-stat-color"
                style={{ backgroundColor: val.color }}
              />
              <span className="mood-stat-name">
                {val.emoji} {val.name}
              </span>
              <span className="mood-stat-count">{val.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
