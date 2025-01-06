"use client";

import React from "react";
import { motion } from "framer-motion";

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

const ServiceData = [
  {
    id: 1,
    title: "Free Transport",
    description:
      "Based on the requirements of our customers, free transport will be provided subject to the stipulated terms & conditions of the contract",
    icon: "/1.png",
    delay: 0.5,
  },
  {
    id: 2,
    title: "Free advice",
    description:
      "We are available on our Hotline, 24 hours a day & 365 days of the year, to provide free advice and consultancy to anyone in our field of work",
    icon: "/2.png",
    delay: 0.8,
  },
  {
    id: 3,
    title: "Money Back Repayment",
    description:
      "Subject to the conditions and our failure to honour the obligations of the contract, we will refund your money if we find the circumstances in each case justify such refund",
    icon: "/3.png",
    delay: 1.1,
  },
];

export default function Services() {
  return (
    <>
      <section className="bg-gray-100 py-8">
        <div className="container py-14">
          <motion.h1
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="text-lg font-semibold text-center text-gray-800 pb-10"
          >
            Our Services
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ServiceData.map((data) => (
              <motion.div key={data.id} variants={fadeUp(data.delay)} initial="hidden" whileInView="show"
                className="flex flex-col justify-center items-center p-5 max-w-[300px] mx-auto shadow-lg rounded-xl bg-white"
              >
                <div>
                  <img src={data.icon} alt="" className="w-[100px] mb-4" />
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-m font-semibold">{data.title}</h2>
                  <p className="text-small text-center">{data.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
