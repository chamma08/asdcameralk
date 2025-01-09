"use client";

import useSWR from "swr";
import { db } from "../firebase";
import { collection, getCountFromServer } from "firebase/firestore";

export const getUsersCount = async () => {
  const ref = collection(db, `users`);
  const data = await getCountFromServer(ref);
  return data.data().count;
};

export function useUsersCount() {
  const { data, error, isLoading } = useSWR("users_count", (key) =>
    getUsersCount()
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}
