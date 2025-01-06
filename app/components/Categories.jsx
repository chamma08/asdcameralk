"use client";

import { Button } from "@nextui-org/react";
import { collection } from "firebase/firestore";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import { easeInOut, motion } from "framer-motion";

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

export default function Categories({ categories }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  if (categories.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <div className="flex justify-center w-full">
        <motion.h1
          variants={fadeUp}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg font-semibold"
        >
          Shop By Category
        </motion.h1>
      </div>
      <Slider {...settings}>
        {(categories?.length <= 2
          ? [...categories, ...categories, ...categories]
          : categories
        )?.map((category) => {
          return (
            <Link href={`/categories/${category?.id}`}>
              <div className="px-2">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <div className="md:h-32 md:w-32 h-24 w-24 rounded-full md:p-5 p-2 border overflow-hidden">
                    <motion.img
                      variants={fadeUp}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                      src={category?.imageURL}
                      alt=""
                    />
                  </div>
                  <h1 className="font-semibold">{category?.name}</h1>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}
