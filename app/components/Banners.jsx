"use client";

import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useBanners } from "@/lib/firestore/banners/read";

const BannerItem = ({ banner, index }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { 
    once: false,
    amount: 0.3, // Trigger animation when 30% of the element is in view
    margin: "100px 0px" // Start animation slightly before element enters viewport
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const bannerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.1 // Staggered animation
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={bannerVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 } 
      }}
      className="overflow-hidden rounded-lg shadow-md flex items-center justify-center bg-gray-50"
    >
      <div className="w-full relative">
        <img
          src={banner.imageURL}
          alt={banner.name || `Banner ${index + 1}`}
          className="w-full h-auto object-contain max-h-96"
        />

        {/* Optional caption overlay with its own animation */}
        {banner.caption && (
          <motion.div 
            className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <p className="text-base font-medium">{banner.caption}</p>
          </motion.div>
        )}

        {/* Optional link overlay, if banners are clickable */}
        {banner.linkURL && (
          <a
            href={banner.linkURL}
            className="absolute inset-0"
            aria-label={banner.caption || `View banner ${index + 1}`}
          />
        )}
      </div>
    </motion.div>
  );
};

const Banners = () => {
  const { data: bannerImages, isLoading, error } = useBanners();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <motion.div 
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="p-4 bg-red-100 text-red-700 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Error loading banner images: {error}
      </motion.div>
    );
  }

  // No banners found
  if (!bannerImages || bannerImages.length === 0) {
    return (
      <motion.div 
        className="p-4 bg-gray-100 text-gray-600 rounded-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No banner images available to display
      </motion.div>
    );
  }

  // Filter to show maximum 10 banners
  const displayedBanners = bannerImages.slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBanners.map((banner, index) => (
          <BannerItem 
            key={banner.id || index} 
            banner={banner} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default Banners;