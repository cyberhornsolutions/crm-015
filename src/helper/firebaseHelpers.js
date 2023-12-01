import { collection, doc, getDoc, updateDoc, where } from "firebase/firestore";
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
