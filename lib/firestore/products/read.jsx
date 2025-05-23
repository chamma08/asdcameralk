"use client";

import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "../firebase";

export function useProducts({ pageLimit, lastSnapDoc }) {
  const { data, error } = useSWRSubscription(
    ["products", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(ref, limit(pageLimit ?? 10));

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
}

export function useProduct({ productId }) {
  const { data, error } = useSWRSubscription(
    ["products", productId],
    ([path, productId], { next }) => {
      const ref = doc(db, `${path}/${productId}`);

      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.data()),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined,
  };
}

export function useProductsByIds({ idsList }) {
  const { data, error } = useSWRSubscription(
    ["products", idsList],
    ([path, idsList], { next }) => {
      const ref = collection(db, path);

      let q = query(ref, where("id", "in", idsList));

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined,
  };
}

// New hook for products by multiple categories
export function useProductsByCategories({ categoryIds }) {
  const { data, error } = useSWRSubscription(
    ["products", "categories", categoryIds],
    ([path, , categoryIds], { next }) => {
      if (!categoryIds || categoryIds.length === 0) {
        next(null, []);
        return () => {};
      }

      const ref = collection(db, path);
      let q = query(ref, where("categoryIds", "array-contains-any", categoryIds));

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined,
  };
}

// Hook for products by single category (maintains backward compatibility)
export function useProductsByCategory({ categoryId }) {
  const { data, error } = useSWRSubscription(
    ["products", "category", categoryId],
    ([path, , categoryId], { next }) => {
      if (!categoryId) {
        next(null, []);
        return () => {};
      }

      const ref = collection(db, path);
      // Check both old categoryId field and new categoryIds array for backward compatibility
      let q = query(ref, where("categoryIds", "array-contains", categoryId));

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined,
  };
}