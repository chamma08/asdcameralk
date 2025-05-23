import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export const getCategory = async ({ id }) => {
  const data = await getDoc(doc(db, `categories/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

export const getCategories = async () => {
  const ref = collection(db, "categories");
  // Order by 'order' field, then by creation timestamp as fallback
  const q = query(ref, orderBy("order", "asc"), orderBy("timestampCreate", "asc"));
  const list = await getDocs(q);
  return list.docs.map((snap) => snap.data());
};