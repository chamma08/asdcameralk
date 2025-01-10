"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { Button } from "@nextui-org/react";
import { sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

import { motion } from "framer-motion";

const fadeDown = (delay) => {
  return {
    hidden: { opacity: 0, y: -100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeUp = (delay) => {
  return {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

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

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data?.email);
      toast.success("Reset Link has been sent to your email!");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5">
        <div className="md:block hidden w-1/2 ">
          <img className="rounded-2xl" src="/f.jpg" alt="Logo" />
        </div>
        <div className="md:w-1/2 px-16">
          <motion.h2
            variants={fadeDown(0.2)}
            initial="hidden"
            whileInView="show"
            className="text-2xl font-semibold text-center"
          >
            Forgot <span className="font-bold">Password</span>
          </motion.h2>
          <motion.p
            variants={fadeDown(0.4)}
            initial="hidden"
            whileInView="show"
            className="text-sm mt-2 text-center"
          >
            Don't worry ! We got you covered
          </motion.p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="flex flex-col gap-3"
          >
            <motion.input
              variants={fadeDown(0.6)}
              initial="hidden"
              whileInView="show"
              placeholder="Enter Your Email"
              type="email"
              name="user-email"
              id="user-email"
              value={data?.email}
              onChange={(e) => {
                handleData("email", e.target.value);
              }}
              className="px-3 py-2 mt-12 rounded-xl border focus:outline-none w-full"
            />
            <Button
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
              className="mt-6"
            >
              Send Reset Link
            </Button>
          </form>
          <motion.div
            variants={fadeUp(0.7)}
            initial="hidden"
            whileInView="show"
            className="mt-6 grid grid-cols-3 items-center text-gray-400"
          >
            <hr className="border-gray-400" />
            <p className="text-center text-xs">OR</p>
            <hr className="border-gray-400" />
          </motion.div>

          <SignInWithGoogleComponent />

          <motion.div
            variants={fadeUp(0.8)}
            initial="hidden"
            whileInView="show"
            className="mt-8 grid grid-cols-3 items-center text-gray-400"
          >
            <hr className="border-gray-400" />
            <p className="text-center text-xs">OR</p>
            <hr className="border-gray-400" />
          </motion.div>

          <div className="flex justify-center gap-4 mt-6">
            <Link href={`/login`}>
              <motion.button
                variants={fadeUp(0.9)}
                initial="hidden"
                whileInView="show"
                className="font-semibold text-sm text-blue-700 hover:text-blue-900"
              >
                Sign In
              </motion.button>
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
      className="w-full mt-8"
    >
      <FcGoogle className="w-6 h-6 mr-2" />
      Log In with Google
    </Button>
  );
}
