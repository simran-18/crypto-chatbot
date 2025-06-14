import { useState } from "react";

export const usePortfolio = () => {
  const [holdings, setHoldings] = useState([]);

  const addHolding = (coin, amount) => {
    setHoldings((prev) => [...prev, { coin, amount }]);
  };

  const getPortfolioValue = () => {
    return holdings.reduce((acc, item) => acc + item.amount * 1000, 0); // Mock
  };

  return { holdings, addHolding, getPortfolioValue };
};
