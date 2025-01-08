"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { Button } from "@nextui-org/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user]);
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5">
        <div className="sm:block hidden w-1/2 ">
          <img className="rounded-2xl" src="/login.png" alt="Logo" />
        </div>
        <div className="sm:w-1/2 px-16">
          <h2 className="text-3xl font-bold text-center">Log In</h2>
          <p className="text-sm mt-4 text-center">
            Enter your credentials to login
          </p>
          <form className="flex flex-col gap-3">
            <input
              placeholder="Enter Your Email"
              type="email"
              name="user-email"
              id="user-email"
              className="mt-8 px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <input
              placeholder="Enter Your Password"
              type="password"
              name="user-password"
              id="user-password"
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <Button color="primary">Login</Button>
          </form>
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>
          <SignInWithGoogleComponent />

          <hr className="mt-6 border-gray-400" />

          <div className="flex justify-between gap-4 mt-2">
            <Link href={`/sign-up`}>
              <button className="font-semibold text-sm text-blue-700">
                Create Account
              </button>
            </Link>
            <Link href={`/forget-password`}>
              <button className="font-semibold text-sm text-red-700">
                Forget Password
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;
      /*  await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      }); */
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleLogin}
      color="default"
      className="w-full mt-4"
    >
      <FcGoogle className="w-6 h-6 mr-2" />
      Log In with Google
    </Button>
  );
}
