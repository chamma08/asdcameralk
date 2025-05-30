"use client";

import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useBanners } from "@/lib/firestore/banners/read";

const BannerCard = ({ banner, index }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { 
    once: false,
    amount: 0.2,
    margin: "50px 0px"
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.15
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-300 shadow-lg cursor-pointer  w-full"
    >
      {/* Red accent stripe */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-2 bg-red-600 z-20"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />

      {/* Image container with fixed height */}
      <div className="relative overflow-hidden h-full">
        <motion.img
          src={banner.imageURL}
          alt={banner.name || `Banner ${index + 1}`}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 bg-gray-50"
          variants={imageVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        />
        
        {/* Black overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        />
      </div>

      {/* Link overlay */}
      {banner.linkURL && (
        <a
          href={banner.linkURL}
          className="absolute inset-0 z-10"
          aria-label={banner.caption || `View banner ${index + 1}`}
        />
      )}

      {/* Corner accent */}
      <motion.div 
        className="absolute top-6 right-6 w-6 h-6 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 z-30"
        initial={{ scale: 0, rotate: -180 }}
        whileHover={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-2xl border-2 border-black">
    <div className="relative">
      <motion.div 
        className="w-16 h-16 border-4 border-black border-t-red-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-red-600 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </div>
);

const Page = () => {
  const { data: bannerImages, isLoading, error } = useBanners();
  const headerRef = React.useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          className="max-w-md p-8 bg-red-50 border-2 border-red-600 rounded-2xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Banners</h2>
          <p className="text-gray-700">{error}</p>
        </motion.div>
      </div>
    );
  }

  // No banners found
  if (!bannerImages || bannerImages.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          className="max-w-md p-8 bg-gray-50 border-2 border-black rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📷</span>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">No Banners Available</h2>
          <p className="text-gray-600">Check back later for new content</p>
        </motion.div>
      </div>
    );
  }

  const displayedBanners = bannerImages.slice(0, 12);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Background Image */}
      <motion.div 
        ref={headerRef}
        className="relative bg-cover bg-center bg-no-repeat text-white py-12 overflow-hidden"
        style={{
          backgroundImage: "url('i2.jpg')"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full opacity-10 z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        <div className="container mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Featured
              <motion.span 
                className="text-red-600 block"
                initial={{ opacity: 0, x: -50 }}
                animate={headerInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Banners
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 font-light"
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Discover our latest collection of stunning visual content
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Banners Grid Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {displayedBanners.map((banner, index) => (
            <BannerCard 
              key={banner.id || index} 
              banner={banner} 
              index={index} 
            />
          ))}
        </motion.div>
      </div>

      {/* Footer accent */}
      <motion.div 
        className="h-2 bg-red-600"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </div>
  );
};

export default Page;