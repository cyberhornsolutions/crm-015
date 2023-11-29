import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateOnlineStatus = async (userId, newStatus) => {
  console.log(userId, 7777);
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { onlineStatus: newStatus });
  } catch (error) {
    console.log(error);
  }
};
