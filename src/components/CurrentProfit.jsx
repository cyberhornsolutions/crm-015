import React from "react";
import { calculateProfit } from "../helper/helpers";
import { useSelector } from "react-redux";

const CurrentProfit = ({ orderData }) => {
  const symbols = useSelector((state) => state.symbols);
  const calculateUpdatedProfit = () => {
    if (orderData.status === "Pending") {
      const newPrice = symbols?.find(
        (item) => item.symbol === orderData.symbol
      );
      return calculateProfit(
        orderData.type,
        newPrice?.price,
        orderData.symbolValue,
        orderData.volume
      );
    } else {
      return orderData.profit;
    }
  };

  const profit = calculateUpdatedProfit();

  return (
    <div style={{ color: `${profit < 0 ? "red" : "green"}` }}>
      {/*  sl,tp,type,currentPrice,symbolValue,volume */}
      {profit.toFixed(6)}
    </div>
  );
};

export default CurrentProfit;
