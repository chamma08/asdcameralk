import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getLogos = async () => {
  const list = await getDocs(collection(db, "logos"));
  return list.docs.map((snap) => snap.data());
}

export const getLogo = async ({ id }) => {
  const data = await getDoc(doc(db, `logos/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};