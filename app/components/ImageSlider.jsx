"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useImages } from '@/lib/firestore/images/read';

// Animation variants moved outside component to prevent re-creation
const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.8, // Reduced for better performance
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5, // Reduced for better performance
      ease: "easeOut",
    },
  }
};

export const dynamic = 'force-dynamic';

export default function ImageSlider() {
  const { data: images, isLoading, error } = useImages();
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Toggle autoplay with useCallback to prevent unnecessary re-renders
  const toggleAutoplay = useCallback(() => {
    setIsAutoplay(prev => !prev);
  }, []);

  // Memoize slider settings to prevent re-creation on each render
  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 600, // Faster transition for smoother feel
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isAutoplay,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.45, 0, 0.55, 1)", // Better easing function
    dotsClass: "slick-dots custom-dots",
    beforeChange: (_, next) => setCurrentSlide(next),
    lazyLoad: 'ondemand', // Add lazy loading
    appendDots: (dots) => (
      <div className="custom-dots-container">
        <ul className="flex justify-center items-center"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-gray-400 hover:bg-black transition-colors"></div>
    ),
  }), [isAutoplay]);

  // Loading state with reduced animation complexity
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error loading images: {error}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="p-4 bg-gray-100 text-gray-600 rounded-lg text-center">
        No images available to display
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative slider-container">
      {/* Autoplay toggle button - wrapped in motion.button for smoother hover effects */}
      <motion.button 
        onClick={toggleAutoplay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
          isAutoplay ? 'bg-green-500/70 text-white' : 'bg-gray-700/50 text-white'
        }`}
      >
        {isAutoplay ? 'Auto' : 'Manual'}
      </motion.button>

      <Slider {...settings}>
        {images.map((image, index) => {
          const imageKey = image.id || `image-${index}`;
          return (
            <div key={imageKey} className="cursor-grab focus:outline-none">
              <div className="flex justify-center items-center bg-gray-50">
                <AnimatePresence mode="wait">
                  {currentSlide === index && (
                    <motion.div
                      key={imageKey}
                      variants={fadeIn}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="w-full h-full"
                    >
                      <img
                        src={image.imageURL}
                        alt={image.name || `Image ${index + 1}`}
                        className="h-[30rem] w-full object-cover bg-center mx-auto"
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </Slider>
      
      {/* Custom styles moved to a separate style component */}
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
          z-index: 1;
        }
        
        .custom-dots li {
          margin: 0 5px;
          transition: transform 0.2s ease;
        }
        
        .custom-dots li:hover {
          transform: scale(1.2);
        }
        
        .custom-dots li.slick-active div {
          background-color: #000000;
          transform: scale(1.3);
        }
        
        /* Improved transition styles */
        .slick-slide {
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.45, 0, 0.55, 1);
          will-change: opacity;
        }
        
        .slick-current {
          opacity: 1;
        }
        
        /* Optimize animations with GPU acceleration */
        .slider-container img {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}