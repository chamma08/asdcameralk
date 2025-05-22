"use client";

import { Button } from "@nextui-org/react";
import { collection } from "firebase/firestore";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
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

// Custom arrow components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110 border border-gray-200"
  >
    <ChevronLeft size={20} className="text-gray-700" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110 border border-gray-200"
  >
    <ChevronRight size={20} className="text-gray-700" />
  </button>
);

export default function Categories({ categories }) {
  var settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  if (categories.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-8 p-5">
      <div className="flex justify-center w-full">
        <motion.h1
          variants={fadeUp}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg font-semibold"
        >
          Rent By Category
        </motion.h1>
      </div>
      <div className="md:px-4 px-2 relative">
        <Slider {...settings}>
          {(categories?.length <= 2
            ? [...categories, ...categories, ...categories]
            : categories
          )?.map((category) => {
            return (
              <Link href={`/categories/${category?.id}`} key={category?.id}>
                <div className="md:px-1 px-1">
                  <div className="flex flex-col items-center justify-center">
                    <div className="md:h-32 md:w-32 h-24 w-24 rounded-xl md:p-4 p-2 border overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <motion.img
                        variants={fadeUp}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        src={category?.imageURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="font-semibold mt-2 text-center">{category?.name}</h1>
                  </div>
                </div>
              </Link>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}