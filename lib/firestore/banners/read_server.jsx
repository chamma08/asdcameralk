import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getBanners = async () => {
  const list = await getDocs(collection(db, "banners"));
  return list.docs.map((snap) => snap.data());
};

export const getBanner = async ({ id }) => {
  const data = await getDoc(doc(db, `banners/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};
