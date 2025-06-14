import { useEffect, useState } from "react";
import { useCryptoAPI } from "../hooks/useCryptoApi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const PriceChart = ({ coin }) => {
  const { getPriceChart } = useCryptoAPI();
  const [data, setData] = useState([]);

  useEffect(() => {
    getPriceChart(coin).then((prices) => {
      const formatted = prices.map(([ts, price]) => ({
        date: new Date(ts).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        price: +price.toFixed(2),
      }));
      setData(formatted);
    });
  }, [coin]);

  return (
    <div className="bg-white rounded-lg shadow p-4 my-4">
      <h2 className="text-md font-semibold mb-2">
        7-Day Price Chart: {coin.toUpperCase()}
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
