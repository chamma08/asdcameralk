"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutButton() {
    const { user } = useAuth();
    if (!user) {
      return <></>;
    }
    return (
      <button
        title="Logout"
        onClick={async () => {
          if (!confirm("Are you sure?")) return;
          try {
            await toast.promise(signOut(auth), {
              error: (e) => e?.message,
              loading: "Loading...",
              success: "Successfully Logged out",
            });
          } catch (error) {
            toast.error(error?.message);
          }
        }}
        className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
      >
        <LogOut size={14} />
      </button>
    );
  }