import {
  collection,
  doc,
  getDoc,
  updateDoc,
  where,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

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
