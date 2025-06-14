import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const useCryptoAPI = () => {
  const getCryptoPrice = async (coin) => {
    const res = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: { ids: coin, vs_currencies: "usd" },
    });
    return res.data[coin]?.usd || "N/A";
  };

  const getTrendingCoins = async () => {
    const res = await axios.get(`${COINGECKO_API}/search/trending`);
    return res.data.coins.map((item) => item.item.name);
  };

  const getCryptoStats = async (coin) => {
    const res = await axios.get(`${COINGECKO_API}/coins/${coin}`);
    const data = res.data;
    return {
      symbol: data.symbol,
      marketCap: data.market_data.market_cap.usd,
      change: data.market_data.price_change_percentage_24h,
      description: data.description.en.split(". ")[0], // short desc
    };
  };

  const getPriceChart = async (coin) => {
    const res = await axios.get(`${COINGECKO_API}/coins/${coin}/market_chart`, {
      params: { vs_currency: "usd", days: 7 },
    });
    return res.data.prices;
  };

  return { getCryptoPrice, getTrendingCoins, getCryptoStats, getPriceChart };
};
