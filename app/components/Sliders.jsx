"use client";

import AuthContextProvider from "@/context/AuthContext";
import { easeIn, easeInOut, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

export const dynamic = 'force-dynamic';

export default function FeaturedProductSlider({ featuredProducts }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots custom-dots", // Add custom class for styling
    appendDots: (dots) => (
      <div className="custom-dots-container">
        <ul className="flex justify-center items-center"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-gray-400 hover:bg-black transition-colors"></div>
    ),
  };
  
  return (
    <div className="overflow-hidden relative slider-container">
      <Slider {...settings}>
        {featuredProducts?.map((product, index) => {
          return (
            <div key={product?.id || index}>
              <div 
                className="flex flex-col-reverse md:flex-row gap-4 p-5 md:px-24 md:py-20 w-full cursor-grab bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(248, 248, 248, 0.9), rgba(248, 248, 248, 0.85)), url('${product?.backgroundImageURL || '/images/c.jpg'}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex-1 flex flex-col md:gap-10 gap-4">
                  <h2 className="text-gray-500 text-xs md:text-base">
                    HOT ARRIVALS
                  </h2>
                  <div className="flex flex-col gap-4">
                    <Link href={`/products/${product?.id}`}>
                      <motion.h1
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1, ease: easeIn }}
                        className="md:text-4xl text-xl font-semibold"
                      >
                        {product?.title}
                      </motion.h1>
                    </Link>
                    <motion.h1
                      variants={fadeUp}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 1 }}
                      className="text-gray-600 md:text-sm text-xs max-w-100 line-clamp-4"
                    >
                      {product?.shortDescription}
                    </motion.h1>
                  </div>
                  <AuthContextProvider>
                    <motion.div
                      variants={fadeUp(0.4)}
                      initial="hidden"
                      whileInView="show"
                      className="flex items-center gap-4"
                    >
                      <Link
                        href={`/checkout?type=buynow&productId=${product?.id}`}
                      >
                        <button className="bg-red-500 hover:bg-red-700 text-white text-xs md:text-sm px-4 py-1.5 rounded-lg">
                          RENT NOW
                        </button>
                      </Link>
                      <AddToCartButton productId={product?.id} type={"large"} />
                      <FavoriteButton productId={product?.id} />
                    </motion.div>
                  </AuthContextProvider>
                </div>
                <div className="">
                  <Link href={`/products/${product?.id}`}>
                    <motion.img
                      variants={fadeUp}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="h-[14rem] md:h-[23rem]"
                      src={product?.featureImageURL}
                      alt=""
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
      
      {/* Custom styles for the dots */}
      <style jsx global>{`
        .custom-dots {
          position: absolute;
          bottom: 15px;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        
        .custom-dots li {
          margin: 0 5px;
        }
        
        .custom-dots li.slick-active div {
          background-color: #000000; /* Blue color for active dot */
        }
      `}</style>
    </div>
  );
}