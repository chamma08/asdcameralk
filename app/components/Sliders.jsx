"use client";

import AuthContextProvider from "@/context/AuthContext";
import { easeIn, easeInOut, motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import Firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestore/firebase";
// Adjust path to your Firebase config

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

export const dynamic = "force-dynamic";

export default function FeaturedProductSlider({ featuredProducts }) {
  const [fallbackImages, setFallbackImages] = useState([]);
  const [activeBackground, setActiveBackground] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch active background image and fallback images
  useEffect(() => {
    const fetchBackgroundAndImages = async () => {
      setLoading(true);
      try {
        // Fetch active background image
        const bgImagesSnapshot = await getDocs(collection(db, "bgImages"));
        let activeBg = null;
        
        bgImagesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isActive) {
            activeBg = data;
          }
        });
        
        setActiveBackground(activeBg);

        // Fetch fallback images only if no featured products
        if (!featuredProducts || featuredProducts.length === 0) {
          const imagesSnapshot = await getDocs(collection(db, "images"));
          const images = [];
          imagesSnapshot.forEach((doc) => {
            const data = doc.data();
            images.push({
              id: doc.id,
              imageURL: data.imageURL,
              name: data.name || `Image ${doc.id}`,
              title: data.title || "Explore Our Collection",
              description:
                data.description || "Discover amazing products and deals",
            });
          });
          
          if (images.length === 0) {
            // Set default images if no images found
            setFallbackImages([
              {
                id: 1,
                imageURL: "/images/slider-1.jpg",
                name: "Default Image 1",
                title: "Welcome to Our Store",
                description: "Discover amazing products",
              },
              {
                id: 2,
                imageURL: "/images/slider-2.jpg",
                name: "Default Image 2",
                title: "Quality Products",
                description: "Find what you're looking for",
              },
            ]);
          } else {
            setFallbackImages(images);
          }
        }
      } catch (error) {
        console.error("Error fetching background and images:", error);
        // Set default images if Firebase fetch fails
        setFallbackImages([
          {
            id: 1,
            imageURL: "/images/slider-1.jpg",
            name: "Default Image 1",
            title: "Welcome to Our Store",
            description: "Discover amazing products",
          },
          {
            id: 2,
            imageURL: "/images/slider-2.jpg",
            name: "Default Image 2",
            title: "Quality Products",
            description: "Find what you're looking for",
          },
        ]);
      }
      setLoading(false);
    };

    fetchBackgroundAndImages();
  }, [featuredProducts]);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !featuredProducts || featuredProducts.length === 0, // Auto-play for image slider
    autoplaySpeed: 4000,
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots) => (
      <div className="custom-dots-container">
        <ul className="flex justify-center items-center"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-gray-400 hover:bg-black transition-colors"></div>
    ),
  };

  // Show loading state
  if ((!featuredProducts || featuredProducts.length === 0) && loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100">
        <div className="text-gray-500">Loading slider...</div>
      </div>
    );
  }

  // Get background image URL for featured products - prioritize active background, then product background, then default
  const getFeaturedProductBackground = (product) => {
    if (activeBackground?.imageURL) {
      return activeBackground.imageURL;
    }
    if (product?.backgroundImageURL) {
      return product.backgroundImageURL;
    }
    return "/images/c.jpg"; // fallback
  };

  // Render featured products slider
  if (featuredProducts && featuredProducts.length > 0) {
    return (
      <div className="overflow-hidden relative slider-container">
        <Slider {...settings}>
          {featuredProducts.map((product, index) => {
            return (
              <div key={product?.id || index}>
                <div
                  className="flex flex-col-reverse md:flex-row gap-4 p-5 md:px-24 md:py-20 w-full cursor-grab bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(248, 248, 248, 0.9), rgba(248, 248, 248, 0.85)), url('${getFeaturedProductBackground(product)}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
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
                        <AddToCartButton
                          productId={product?.id}
                          type={"large"}
                        />
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
            background-color: #000000;
          }
        `}</style>
      </div>
    );
  }

  // Render image slider fallback
  return (
    <div className="overflow-hidden relative slider-container">
      <Slider {...settings}>
        {fallbackImages.map((image, index) => {
          return (
            <div key={image?.id || index}>
              <div
                className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center cursor-grab"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('${image?.imageURL}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <motion.h1
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-2xl md:text-5xl font-bold mb-4"
                    >
                      {image?.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-sm md:text-lg mb-6 max-w-2xl mx-auto"
                    >
                      {image?.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    >
                      <Link href="/products">
                        <button className="bg-red-500 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                          EXPLORE PRODUCTS
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </div> */}
              </div>
            </div>
          );
        })}
      </Slider>

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
          background-color: #ffffff;
        }

        .custom-dots div {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}