import { useState } from "react";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const symbolToId = {
  BTC: "bitcoin",
  ETH: "ethereum",
  ADA: "cardano",
  BNB: "binancecoin",
  XRP: "ripple",
  DOGE: "dogecoin",
  MATIC: "matic-network",
};

export const usePortfolio = () => {
  const [holdings, setHoldings] = useState({});

  const addHolding = (symbol, amount) => {
    setHoldings((prev) => {
      const upper = symbol.toUpperCase();
      return {
        ...prev,
        [upper]: (prev[upper] || 0) + amount,
      };
    });
  };

  const getPortfolioValue = async () => {
    const symbols = Object.keys(holdings);
    if (!symbols.length) return 0;

    const ids = symbols.map((sym) => symbolToId[sym] || sym.toLowerCase()).join(",");

    try {
      const res = await fetch(`${COINGECKO_API}?ids=${ids}&vs_currencies=usd`);
      const data = await res.json();
      let total = 0;

      symbols.forEach((symbol) => {
        const id = symbolToId[symbol] || symbol.toLowerCase();
        const price = data[id]?.usd || 0;
        total += holdings[symbol] * price;
      });

      return total;
    } catch (error) {
      console.error("Error fetching portfolio value:", error);
      return 0;
    }
  };

  return { holdings, addHolding, getPortfolioValue };
};