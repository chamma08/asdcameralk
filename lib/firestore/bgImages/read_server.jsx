import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";


export const getBgImages = async () => {
  const list = await getDocs(collection(db, "bgImages"));
  return list.docs.map((snap) => snap.data());
}

export const getBgImage = async ({ id }) => {
  const data = await getDoc(doc(db, `bgImages/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};