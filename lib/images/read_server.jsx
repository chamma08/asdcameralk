import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firestore/firebase";

export const getImages = async () => {
  const list = await getDocs(collection(db, "images"));
  return list.docs.map((snap) => snap.data());
};
export const getImage = async ({ id }) => {
  const data = await getDoc(doc(db, `images/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};
