"use client";

import { db } from "@/lib/firestore/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useSWR from "swr";

// -------- REDBAR SETTINGS -------- //

// Fetch redbar settings
export const getRedbarSettings = async () => {
  try {
    const docRef = doc(db, "settings", "redbar");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default values if settings don't exist yet
      return {
        openText: "WE ARE OPEN NOW",
        closedText: "WE ARE CLOSED NOW",
        phoneNumbers: ["011 2 687 687", "011 2 687 688", "077 7 687 687"],
      };
    }
  } catch (error) {
    console.error("Error fetching redbar settings:", error);
    throw error;
  }
};

// Save redbar settings
export const saveRedbarSettings = async ({
  openText,
  closedText,
  phoneNumbers,
}) => {
  try {
    await setDoc(doc(db, "settings", "redbar"), {
      openText,
      closedText,
      phoneNumbers,
    });
    return true;
  } catch (error) {
    console.error("Error saving redbar settings:", error);
    throw error;
  }
};

// Custom hook for using redbar settings with SWR
export function useRedbarSettings() {
  const { data, error, isLoading, mutate } = useSWR("redbar_settings", () =>
    getRedbarSettings()
  );

  return {
    data,
    error: error?.message,
    isLoading,
    refresh: mutate,
  };
}

// -------- FOOTER SETTINGS -------- //

// Fetch footer settings
export const getFooterSettings = async () => {
  try {
    const docRef = doc(db, "settings", "footer");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default values if settings don't exist yet
      return {
        phoneNumbers: {
          JaEla: [
            "(+94) 70 300 9000",
            "(+94) 76 300 9000",
            "(+94) 70 400 9005",
          ],
          Kurunegala: ["(+94) 70 400 9000", "(+94) 76 400 9000"],
          Colombo: ["(+94) 72 500 9000"],
        },
        addresses: {
          JaEla: "123 Main Street, JaEla, Sri Lanka",
          Kurunegala: "456 Central Road, Kurunegala, Sri Lanka",
          Colombo: "789 Business Avenue, Colombo, Sri Lanka"
        },
        email: "asdcameralk@gmail.com",
      };
    }
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    throw error;
  }
};

// Save footer settings
export const saveFooterSettings = async (footerData) => {
  try {
    await setDoc(doc(db, "settings", "footer"), footerData);
    return true;
  } catch (error) {
    console.error("Error saving footer settings:", error);
    throw error;
  }
};

// Custom hook for using footer settings with SWR
export function useFooterSettings() {
  const { data, error, isLoading, mutate } = useSWR("footer_settings", () =>
    getFooterSettings()
  );

  return {
    data,
    error: error?.message,
    isLoading,
    refresh: mutate,
  };
}