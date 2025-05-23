import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  or,
} from "firebase/firestore";
import { db } from "../firebase";

export const getProduct = async ({ id }) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map((snap) => snap.data());
};

export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return list.docs.map((snap) => snap.data());
};

// Updated to support multiple categories - maintains backward compatibility
export const getProductsByCategory = async ({ categoryId }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      or(
        where("categoryId", "==", categoryId), // For backward compatibility
        where("categoryIds", "array-contains", categoryId) // New multiple categories support
      )
    )
  );
  return list.docs.map((snap) => snap.data());
};

// New function to get products by multiple categories
export const getProductsByCategories = async ({ categoryIds }) => {
  if (!categoryIds || categoryIds.length === 0) {
    return [];
  }

  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryIds", "array-contains-any", categoryIds)
    )
  );
  return list.docs.map((snap) => snap.data());
};

// New function to get products that belong to ALL specified categories
export const getProductsByAllCategories = async ({ categoryIds }) => {
  if (!categoryIds || categoryIds.length === 0) {
    return [];
  }

  // For multiple categories with AND logic, we need to filter client-side
  // as Firestore doesn't support array-contains for multiple values with AND logic
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  
  return list.docs
    .map((snap) => snap.data())
    .filter((product) => {
      const productCategories = product.categoryIds || [];
      return categoryIds.every(categoryId => productCategories.includes(categoryId));
    });
};