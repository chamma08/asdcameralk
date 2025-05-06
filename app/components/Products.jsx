"use client";

import AuthContextProvider from "@/context/AuthContext";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import Link from "next/link";
import React, { Suspense } from "react";
import MyRating from "./MyRating";
import { easeInOut, motion } from "framer-motion";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";

export const dynamic = 'force-dynamic';

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
  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[1200px] p-5">
        <motion.h1
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="show"
          className="text-center font-semibold text-lg"
        >
          Products
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  // The function to open Facebook Messenger
  const openMessenger = (e) => {
    e.preventDefault();
    
    // Replace 'YOUR_PAGE_ID' with your actual Facebook Page ID
    const pageId = "YOUR_PAGE_ID";
    
    // You can customize the initial message to include product details
    const message = encodeURIComponent(`I'm interested in renting: ${product?.title}`);
    
    // Create the messenger URL
    const messengerUrl = `https://m.me/${pageId}?ref=${product?.id}&initialMessage=${message}`;
    
    // Open the URL in a new tab
    window.open(messengerUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-3 border p-4 rounded-lg">
      <div className="relative w-full">
        <motion.img
          variants={fadeUp(0.5)}
          initial="hidden"
          whileInView="show"
          src={product?.featureImageURL}
          className="rounded-lg h-48 w-full object-cover"
          alt={product?.title}
        />
        <div className="absolute top-1 right-1">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>
      <Link href={`/products/${product?.id}`}>
        <h1 className="font-semibold line-clamp-2 text-sm">{product?.title}</h1>
      </Link>
      <div className="">
        <h2 className="text-green-500 text-sm font-semibold">
          LKR {product?.salePrice}
          {product?.salePrice !== product?.price && (
            <span className="line-through text-xs text-gray-600 ml-2">
              LKR {product?.price}
            </span>
          )}
        </h2>
      </div>

      {/* <p className="text-xs text-gray-500 line-clamp-1">
        {product?.shortDescription}
      </p> */}
      {/* <Suspense>
        <RatingReview product={product} />
      </Suspense> */}
      {/* {product?.stock <= (product?.orders ?? 0) && (
        <div className="flex">
          <h3 className="text-red-500 rounded-lg text-xs font-semibold">
            Out Of Stock
          </h3>
        </div>
      )} */}
      <div className="flex items-center gap-4 w-full">
        <div className="w-full">
          {/* Changed from Link to button with onClick handler */}
          <button 
            onClick={openMessenger} 
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-xs w-full"
          >
            Rent Now
          </button>
        </div>
        <AuthContextProvider>
          <AddToCartButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
        )
      </h1>
    </div>
  );
}