import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc, getDocs, query, orderBy } from "firebase/firestore";

export const createNewCategory = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is required");
  }
  if (!data?.name) {
    throw new Error("Data is Required");
  }
  if (!data?.slug) {
    throw new Error("Slug is Required");
  }

  const newId = doc(collection(db, `ids`)).id;
  const imageRef = ref(storage, `categories/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  // Get the highest order number and add 1
  const categoriesRef = collection(db, "categories");
  const q = query(categoriesRef, orderBy("order", "desc"));
  const snapshot = await getDocs(q);
  
  let maxOrder = 0;
  if (!snapshot.empty) {
    const firstDoc = snapshot.docs[0].data();
    maxOrder = firstDoc.order || 0;
  }

  await setDoc(doc(db, `categories/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    order: maxOrder + 1,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCategory = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  const id = data?.id;

  let imageURL = data?.imageURL;

  if (image) {
    const imageRef = ref(storage, `categories/${id}`);
    await uploadBytes(imageRef, image);
    imageURL = await getDownloadURL(imageRef);
  }

  await updateDoc(doc(db, `categories/${id}`), {
    ...data,
    imageURL: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const updateCategoryOrder = async ({ id, order }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  if (order === undefined || order === null) {
    throw new Error("Order is required");
  }

  await updateDoc(doc(db, `categories/${id}`), {
    order: order,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCategory = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `categories/${id}`));
};