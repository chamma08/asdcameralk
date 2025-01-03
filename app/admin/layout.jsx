"use client";

import React, { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import AuthContextProvider, { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@nextui-org/react";

export default function layout({ children }) {
  return (
    <AuthContextProvider>
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
}

function AdminChecking({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1>Please Login First!</h1>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}