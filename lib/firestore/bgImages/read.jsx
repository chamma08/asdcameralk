import { collection, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "../firebase";

export function useBgImages() {
  const { data, error } = useSWRSubscription(
    ["bgImages"],
    ([path], { next }) => {
      const ref = collection(db, path);
      const unsub = onSnapshot(
        ref,
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