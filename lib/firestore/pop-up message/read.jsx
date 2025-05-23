import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useSWRSubscription from "swr/subscription";

export function usePopUpMessage() {
  const { data, error } = useSWRSubscription(
    ["pop-up"],
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

// New hook to get the active popup message that should be displayed
export function useActivePopUpMessage() {
  const { data, error } = useSWRSubscription(
    ["pop-up"],
    ([path], { next }) => {
      const ref = collection(db, path);
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const activeMessage = snapshot.docs
            .map((snap) => snap.data())
            .find((message) => message.showInPopup === true && message.isActive === true);
          next(null, activeMessage || null);
        },
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}

// New hook to get popup settings
export function usePopupSettings() {
  const { data, error } = useSWRSubscription(
    ["settings", "popup"],
    ([collectionName, docName], { next }) => {
      const ref = doc(db, `${collectionName}/${docName}`);
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            next(null, snapshot.data());
          } else {
            next(null, { showPopup: false }); // default value
          }
        },
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}