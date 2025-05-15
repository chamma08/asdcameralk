"use client";

import React from "react";
import { motion } from "framer-motion";
import { useBanners } from "@/lib/firestore/banners/read";

const Banners = () => {
  const { data: bannerImages, isLoading, error } = useBanners();

  // Animation variants for each banner
  const bannerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, // Staggered animation
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error loading banner images: {error}
      </div>
    );
  }

  // No banners found
  if (!bannerImages || bannerImages.length === 0) {
    return (
      <div className="p-4 bg-gray-100 text-gray-600 rounded-lg text-center">
        No banner images available to display
      </div>
    );
  }

  // Filter to show maximum 10 banners
  const displayedBanners = bannerImages.slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBanners.map((banner, index) => (
          <motion.div
            key={banner.id || index}
            custom={index}
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="overflow-hidden rounded-lg shadow-md flex items-center justify-center bg-gray-50"
          >
            <div className="w-full relative">
              <img
                src={banner.imageURL}
                alt={banner.name || `Banner ${index + 1}`}
                className="w-full h-auto object-contain max-h-96"
              />

              {/* Optional caption overlay */}
              {banner.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-3">
                  <p className="text-base font-medium">{banner.caption}</p>
                </div>
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
        ))}
      </div>
    </div>
  );
};

export default Banners;
