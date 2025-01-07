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

export default function Collections({ collections }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (collections.length === 0) {
    return <></>;
  }

  return (
    <div className="overflow-hidden md:p-10 p-5 -z-50">
      <div className="text-center mb-4">
        <motion.h1
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="show"
          className="text-lg md:text-lg font-semibold"
        >
          Collections
        </motion.h1>
      </div>
      <Slider {...settings}>
        {(collections?.length <= 2
          ? [...collections, ...collections, ...collections]
          : collections
        )?.map((collection) => {
          return (
            <div className="px-2">
              <div className="flex gap-4 bg-gradient-to-tr to-[#d9e2f1] from-[#cce7f5] p-7 w-full rounded-xl h-full">
                <div className="w-full flex flex-col gap-2">
                  <div className="flex flex-col gap-4">
                    <h1 className="md:text-lg text-base font-semibold">
                      {collection?.title}
                    </h1>
                    <h1 className="text-gray-600 text-xs md:text-sm max-w-96 line-clamp-2">
                      {collection?.subTitle}
                    </h1>
                  </div>
                  <div className="flex gap-4">
                    <Link href={`/collections/${collection?.id}`}>
                      <button className="bg-blue-500 hover:bg-blue-950 text-white text-xs md:text-sm px-4 py-2 rounded-lg">
                        SHOP NOW
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="w-full">
                  <img
                    className="h-[4rem] md:h-[9rem]"
                    src={collection?.imageURL}
                    alt={collection?.title}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
