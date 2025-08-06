import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const PriceChart = ({ priceHistory, timeframe }) => {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No price data yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Data collection in progress
          </p>
        </div>
      </div>
    );
  }

  // Handle both old and new data formats
  const points = priceHistory
    .filter(p => {
      const price = p.c || p.price;
      const timestamp = p.t || p.timestamp;
      return price > 0 && timestamp;
    })
    .map(p => ({
      t: p.t || new Date(p.timestamp).getTime(),
      c: p.c || parseFloat(p.price),
      v: p.v || parseFloat(p.volume) || 0
    }))
    .sort((a, b) => a.t - b.t);

  console.log(`[CHART] ${timeframe}: ${points.length} points`, 
             points.length > 0 ? new Date(points[0].t) : 'none',
             points.length > 0 ? new Date(points[points.length-1].t) : 'none');

  if (points.length === 0) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No valid price data
        </p>
      </div>
    );
  }

  // Create fresh data object every render
  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: points.map(point => ({
          x: new Date(point.t),
          y: point.c
        })),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        spanGaps: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Price: $${context.parsed.y.toFixed(6)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM dd'
          }
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(6);
          },
          maxTicksLimit: 6
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Force re-render with coin-specific key
  const coinId = priceHistory[0]?.coinAddress || priceHistory[0]?.address || 'unknown';
  const chartKey = `${coinId}-${timeframe}-${points.length}-${points[0]?.t}-${points[points.length-1]?.t}`;

  return (
    <div className="h-64">
      <Line 
        key={chartKey}
        data={chartData} 
        options={options} 
      />
    </div>
  );
};

export default PriceChart;