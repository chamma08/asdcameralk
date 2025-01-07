"use client";

import { Rating } from "@mui/material";
import { delay, easeInOut, motion } from "framer-motion";

const fadeUp = (delay) => {
  return {
    hidden: { opacity: 0, y: 100, scale: 0.5 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: delay,
        duration: 0.5,
        ease: easeInOut,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.5,
      transition: {
        duration: 0.5,
        ease: easeInOut,
      },
    },
  };
};

export default function CustomerReviews() {
  const list = [
    {
      id: 1,
      name: "Nisali Perera",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      rating: 4.5,
      delay: 0.5,
      imageLink:
        "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-1.jpg?v=1721992196&width=512",
    },
    {
      id: 2,
      name: "Krishan Sooriyakumara",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      rating: 5,
      delay: 0.8,
      imageLink:
        "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-5.jpg?v=1721992196&width=512",
    },
    {
      id: 3,
      name: "Dilini Hansika",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      rating: 4.5,
      delay: 1.1,
      imageLink:
        "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-6.jpg?v=1721992197&width=512",
    },
  ];
  return (
    <section className="flex justify-center bg-gray-100">
      <div className="w-full p-5 md:max-w-[900px] flex flex-col gap-3">
        <motion.h1
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="show"
          className="text-center font-semibold text-xl"
        >
          Customer Reviews
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {list?.map((item) => {
            return (
              <motion.div key={item.id} variants={fadeUp(item.delay)} initial="hidden" whileInView="show" className="flex flex-col gap-2 p-4 rounded-lg justify-center items-center border bg-white shadow-md">
                <img
                  src={item?.imageLink}
                  className="h-32 w-32 rounded-full object-cover"
                  alt=""
                />
                <h1 className="text-sm font-semibold">{item?.name}</h1>
                <Rating
                  size="small"
                  name="customer-rating"
                  defaultValue={item?.rating}
                  precision={item?.rating}
                  readOnly
                />
                <p className="text-sm text-gray-500 text-center">
                  {item?.message}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
