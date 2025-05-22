"use client";

import AuthContextProvider from "@/context/AuthContext";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import MyRating from "./MyRating";
import { easeInOut, motion } from "framer-motion";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

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

export default function ProductsGridView({ products }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  return (
    <section className="w-full flex justify-center bg-gray-50">
      <div className="flex flex-col gap-5 max-w-[1200px] p-5 w-full">
        <motion.div 
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="show"
          className="text-center mb-4"
        >
          <h1 className="font-bold text-2xl md:text-3xl text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-2">Quality equipment available for rent</p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products?.map((item, index) => (
            <ProductCard 
              product={item} 
              key={`product-${item?.id}-${index}`} // Better key for re-rendering
              delay={index * 0.1}
              isHovered={hoveredProduct === item.id}
              onHover={() => setHoveredProduct(item.id)}
              onLeave={() => setHoveredProduct(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product, delay = 0.5, isHovered, onHover, onLeave }) {
  // The function to open Facebook Messenger
  const openMessenger = (e) => {
    e.preventDefault();

    // Replace 'YOUR_PAGE_ID' with your actual Facebook Page ID
    const pageId = "YOUR_PAGE_ID";

    // You can customize the initial message to include product details
    const message = encodeURIComponent(
      `I'm interested in renting: ${product?.title}`
    );

    // Create the messenger URL
    const messengerUrl = `https://m.me/${pageId}?ref=${product?.id}&initialMessage=${message}`;

    // Open the URL in a new tab
    window.open(messengerUrl, "_blank");
  };

  const discountPercentage = product?.price && product?.salePrice && product?.price !== product?.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  // Ensure product has valid ID
  if (!product?.id) {
    console.warn("Product missing ID:", product);
    return null;
  }

  return (
    <motion.div 
      variants={fadeUp(delay)}
      initial="hidden"
      whileInView="show"
      exit="exit"
      whileHover={{ y: -5 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="flex flex-col border border-gray-200 p-4 rounded-lg relative h-[380px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Discount badge */}
      {discountPercentage && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          {discountPercentage}% OFF
        </div>
      )}
      
      {/* Favorite button */}
      <div className="absolute top-2 right-2 z-10">
        <AuthContextProvider>
          <FavoriteButton productId={product?.id} />
        </AuthContextProvider>
      </div>

      {/* Product image */}
      <Link href={`/products/${product?.id}`} className="flex-shrink-0 block overflow-hidden rounded-lg">
        <div className="relative w-full overflow-hidden rounded-lg">
          <motion.div
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.3, ease: easeInOut }
            }}
            className="h-48 w-full"
          >
            <motion.img
              variants={fadeUp(delay + 0.2)}
              initial="hidden"
              whileInView="show"
              src={product?.featureImageURL}
              className="rounded-lg h-full w-full object-cover"
              alt={product?.title || "Product"}
              loading="lazy"
            />
          </motion.div>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-grow pt-3">
        <Link href={`/products/${product?.id}`}>
          <h1 className="font-semibold line-clamp-2 text-sm md:text-base h-12 text-gray-800 hover:text-red-600 transition-colors duration-200">
            {product?.title || "Untitled Product"}
          </h1>
        </Link>
        
        {/* <div className="mt-2 flex items-center">
          <Suspense fallback={<div className="h-5"></div>}>
            <RatingReview product={product} />
          </Suspense>
        </div> */}
        
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-red-600 font-bold text-base md:text-lg">
              LKR {product?.salePrice?.toLocaleString() || product?.price?.toLocaleString() || "0"}
            </h2>
            {product?.salePrice !== product?.price && product?.price && (
              <span className="line-through text-xs text-gray-500">
                LKR {product?.price?.toLocaleString()}
              </span>
            )}
          </div>
          {/* {product?.stock <= (product?.orders ?? 0) ? (
            <p className="text-xs text-red-500 font-medium mt-1">Out of Stock</p>
          ) : (
            <p className="text-xs text-green-600 font-medium mt-1">Available Now</p>
          )} */}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 w-full pt-3">
        <button
          onClick={openMessenger}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full transition-colors duration-200"
        >
          Rent Now
        </button>
        <AuthContextProvider>
          <AddToCartButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </motion.div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-2 items-center">
      <MyRating value={counts?.averageRating ?? 0} size="small" />
      <h1 className="text-xs text-gray-500">
        <span>{counts?.averageRating?.toFixed(1) || "0.0"}</span> 
        <span className="ml-1">({counts?.totalReviews || 0})</span>
      </h1>
    </div>
  );
}