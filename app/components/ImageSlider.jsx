"use client";

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useImages } from '@/lib/firestore/images/read';

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  }
};

export const dynamic = 'force-dynamic';

export default function ImageSlider() {
  const { data: images, isLoading, error } = useImages();
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error loading images: {error}
      </div>
    );
  }

  // No images found
  if (!images || images.length === 0) {
    return (
      <div className="p-4 bg-gray-100 text-gray-600 rounded-lg text-center">
        No images available to display
      </div>
    );
  }

  // Settings for the slider with beforeChange and afterChange for animation control
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isAutoplay,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: true, // Enable fade transition between slides
    cssEase: "linear",
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

  return (
    <div className="overflow-hidden relative slider-container">
      {/* Autoplay toggle button */}
      <button 
        onClick={() => setIsAutoplay(!isAutoplay)}
        className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all ${
          isAutoplay ? 'bg-green-500/70 text-white' : 'bg-gray-700/50 text-white'
        }`}
      >
        {isAutoplay ? 'Auto' : 'Manual'}
      </button>

      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={image.id || index} className="cursor-grab">
            <div className="flex justify-center items-center bg-gray-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={image.id || index}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="w-full h-full"
                >
                  <img
                    src={image.imageURL}
                    alt={image.name || `Image ${index + 1}`}
                    className="h-[30rem] w-full bg-cover object-cover bg-center mx-auto"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </Slider>
      
      {/* Custom styles for the dots */}
      <style jsx global>{`
        .custom-dots {
          position: absolute;
          bottom: 15px;
          width: 100%;
          display: flex;
          justify-center: center;
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
        
        /* Additional styles for smooth transitions */
        .slick-slide {
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }
        
        .slick-current {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

