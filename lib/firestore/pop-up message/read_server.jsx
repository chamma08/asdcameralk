import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const getPopUpImages = async () => {
  const list = await getDocs(collection(db, "pop-up"));
  return list.docs.map((snap) => snap.data());
};

export const getPopUpImage = async ({ id }) => {
  const data = await getDoc(doc(db, `pop-up/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

// Get the currently active popup message
export const getActivePopUpMessage = async () => {
  const q = query(
    collection(db, "pop-up"), 
    where("showInPopup", "==", true),
    where("isActive", "==", true)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }
  return null;
};

// Get popup settings
export const getPopupSettings = async () => {
  const data = await getDoc(doc(db, "settings/popup"));
  if (data.exists()) {
    return data.data();
  } else {
    return { showPopup: false }; // default value
  }
};