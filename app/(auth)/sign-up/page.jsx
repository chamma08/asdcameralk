"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data?.email,
        data?.password
      );
      await updateProfile(credential.user, {
        displayName: data?.name,
      });
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: data?.name,
        photoURL: user?.photoURL,
      });
      toast.success("Successfully Sign Up");
      router.push("/");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5">
        <div className="md:block hidden w-1/2 ">
          <img className="rounded-2xl" src="/sign.jpg" alt="Logo" />
        </div>
        <div className="md:w-1/2 px-16">
          <h2 className="text-2xl font-bold text-center">Create An Account</h2>
          <p className="text-sm mt-2 text-center">
            Enter your details to Register
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col gap-3"
          >
            <input
              placeholder="Enter Your Name"
              type="text"
              name="user-name"
              id="user-name"
              value={data?.name}
              onChange={(e) => {
                handleData("name", e.target.value);
              }}
              className="px-3 mt-6 py-2 rounded-xl border focus:outline-none w-full"
            />
            <input
              placeholder="Enter Your Email"
              type="email"
              name="user-email"
              id="user-email"
              value={data?.email}
              onChange={(e) => {
                handleData("email", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <input
              placeholder="Enter Your Password"
              type="password"
              name="user-password"
              id="user-password"
              value={data?.password}
              onChange={(e) => {
                handleData("password", e.target.value);
              }}
              className="px-3 py-2 rounded-xl mb-4 border focus:outline-none w-full"
            />
            <Button
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
            >
              Sign Up
            </Button>
          </form>
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-xs">OR</p>
            <hr className="border-gray-400" />
          </div>
          
          <SignInWithGoogleComponent />

          <hr className="mt-6 border-gray-400" />

          <div className="flex justify-center gap-4 mt-2">
            <Link href={`/login`}>
              <button className="font-semibold text-sm text-blue-700">
                Already Have An Account
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
       await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
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
