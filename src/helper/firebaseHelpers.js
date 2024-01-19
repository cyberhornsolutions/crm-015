import {
  collection,
  doc,
  getDoc,
  updateDoc,
  where,
  query,
  onSnapshot,
  serverTimestamp,
  addDoc,
  setDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export const fetchAllOrdersByUserId = (userId, setState) => {
  if (!userId) return;
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdTime", "desc"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setState(orders);
    });
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

//update user onlineStatus
export const updateOnlineStatus = async (userId, newStatus) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { onlineStatus: newStatus });
  } catch (error) {
    console.log(error);
  }
};

//Get user data

export const getUserData = async (userId) => {
  try {
    let data = {};
    const q = collection(db, "users", where("docId", "==", userId));

    const snapshot = await getDoc(q);

    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      data = doc.data;
    });
    console.log(123123, data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getData = (collectionName) => {
  return new Promise((resolve, reject) => {
    try {
      const dataCollection = collection(db, collectionName);
      const unsubscribe = onSnapshot(
        dataCollection,
        (querySnapshot) => {
          const result = [];
          querySnapshot.forEach((doc) => {
            result.push(doc.data());
          });
          resolve(result);
        },
        (error) => {
          console.error("Error fetching data:", error);
          reject(error);
        }
      );
      // Optionally returning unsubscribe function for cleanup if needed
      // return unsubscribe;
    } catch (error) {
      console.error("Error:", error);
      reject(error);
    }
  });
};

export const getSymbolValue = (symbol) => {
  return new Promise((resolve, reject) => {
    try {
      const symbolsCollection = collection(db, "symbols");
      const q = query(symbolsCollection, where("symbol", "==", symbol.value));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let price = null;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          price = doc.data().price;
        });
        const parsePrice = parseFloat(price);
        resolve(parsePrice);
      });
      // If you need to handle errors within the snapshot listener
      // querySnapshot should have an error handler
      // querySnapshot.onError((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

export const addQuotesToUser = async (userId, symbols) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { quotes: symbols });
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const addUserNewBalance = async (userId, amount) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const currentBalanceString = userData.totalBalance || 0;
      const currentBalance = parseFloat(currentBalanceString);
      const updatedBalance = currentBalance + parseFloat(amount);

      // Update the balance in the database directly
      await setDoc(
        userDocRef,
        { totalBalance: updatedBalance },
        { merge: true }
      );

      const depositRef = collection(db, "deposits");

      await addDoc(depositRef, {
        userId: userId,
        amount: parseFloat(amount),
        comment: "Bonus",
        createdAt: serverTimestamp(),
      });

      console.log("Balance updated successfully!");
    } else {
      console.error("User ID does not exist in the database.");
    }
  } catch (error) {
    console.error("Error updating balance:", error);
  }
};

export const getAllSymbols = (setState, setLoading) => {
  setLoading(true);
  try {
    const q = query(
      collection(db, "symbols"),
      where("symbol", "in", ["BTCUSDT", "ETHUSDT", "DOGEUSDT"])
    );

    // const symbolsRef = collection(db, "symbols");
    const unsubscribe = onSnapshot(
      // symbolsRef,
      q,
      (snapshot) => {
        const symbols = [];
        snapshot.forEach((doc) => {
          symbols.push({ id: doc.id, ...doc.data() });
        });

        const symbolsData = symbols
          // .filter(({ symbol }) => symbol.endsWith("USDT"))
          .map((s) => {
            return s.duplicates?.length
              ? [
                  s,
                  ...s.duplicates.map((m) => ({
                    symbolId: s.id,
                    symbol: m,
                    price: s.price,
                    duplicate: s.symbol,
                    settings: s.settings,
                  })),
                ]
              : s;
          })
          .flat();

        setState(symbolsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getDepositsByUser = (userId, setState) => {
  try {
    const depositsRef = collection(db, "deposits");
    const userDepositsQuery = query(
      depositsRef,
      orderBy("createdAt", "desc"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      userDepositsQuery,
      (snapshot) => {
        const depositsData = [];
        snapshot.forEach((doc) => {
          depositsData.push({ id: doc.id, ...doc.data() });
        });
        setState(depositsData);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    return () => unsubscribe();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getAllBonus = (userId, setState) => {
  try {
    const depositsRef = collection(db, "deposits");
    const userDepositsQuery = query(
      depositsRef,
      where("userId", "==", userId),
      where("type", "==", "Bonus")
    );

    const unsubscribe = onSnapshot(
      userDepositsQuery,
      (snapshot) => {
        const depositsData = [];
        snapshot.forEach((doc) => {
          depositsData.push({ id: doc.id, ...doc.data() });
        });
        const allBonus = depositsData.reduce(
          (p, v) => p + parseFloat(v.sum),
          0
        );
        setState(allBonus);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    return () => unsubscribe();
  } catch (error) {
    console.error("Error:", error);
  }
};
