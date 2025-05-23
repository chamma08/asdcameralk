"use client";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import useSWRSubscription  from "swr/subscription";

export function useCategories() {
  const { data, error } = useSWRSubscription(
    ["categories"],
    ([path], { next }) => {
      const ref = collection(db, path);
      // Order by 'order' field, then by creation timestamp as fallback
      const q = query(ref, orderBy("order", "asc"), orderBy("timestampCreate", "asc"));
      
      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? null
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}