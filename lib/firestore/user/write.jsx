import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createUser = async ({ uid, displayName, photoURL }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      displayName: displayName,
      photoURL: photoURL ?? "",
      timestampCreate: Timestamp.now(),
    },
    { merge: true }
  );
};

export const updateFavorites = async ({ uid, list }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      favorites: list,
    },
    {
      merge: true,
    }
  );
};

export const updateCarts = async ({ uid, list }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      carts: list,
    },
    {
      merge: true,
    }
  );
};
