import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const PriceChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        if (!res.ok) throw new Error("Failed to fetch chart data");
        const data = await res.json();

        const labels = data.prices.map((item) => {
          const date = new Date(item[0]);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const prices = data.prices.map((item) => item[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId.toUpperCase()} 7-Day Price (USD)`,
              data: prices,
              fill: true,
              borderColor: "#4F46E5",
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchChartData();
  }, [coinId]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!chartData) return <p className="text-gray-500">Loading chart...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#e5e7eb" } },
        },
      }} />
    </div>
  );
};

export default PriceChart;
