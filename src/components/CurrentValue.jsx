import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
// import { getSymbolValue } from "../helper/firebaseHelpers";

const CurrentValue = ({ symbol }) => {
  const [price, setPrice] = useState(0);

  const getSymbolValue = (symbol) => {
    return new Promise((resolve, reject) => {
      try {
        const symbolsCollection = collection(db, "symbols");
        const q = query(symbolsCollection, where("symbol", "==", symbol));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let price = null;
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            price = doc.data().price;
          });
          const parsePrice = parseFloat(price);
          resolve(setPrice(parsePrice));
        });
        // If you need to handle errors within the snapshot listener
        // querySnapshot should have an error handler
        // querySnapshot.onError((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };
  useEffect(() => {
    getSymbolValue(symbol);
  }, [symbol]);
  return price;
};

export default CurrentValue;
