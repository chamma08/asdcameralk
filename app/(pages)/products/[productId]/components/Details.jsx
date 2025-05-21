"use client";

import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";
import MyRating from "@/app/components/MyRating";
import AuthContextProvider from "@/context/AuthContext";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import Link from "next/link";
import { Suspense } from "react";
import ProductLinks from "./ProductLinks"; // Import the new component

export default function Details({ product }) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Only show category/brand container if at least one exists */}
      {(product?.categoryId || product?.brandId) && (
        <div className="flex gap-3">
          {product?.categoryId && <Category categoryId={product.categoryId} />}
          {product?.brandId && <Brand brandId={product.brandId} />}
        </div>
      )}
      <h1 className="font-semibold text-xl md:text-4xl">{product?.title}</h1>
      {/* {product?.id && (
        <Suspense fallback={null}>
          <RatingReview product={product} />
        </Suspense>
      )} */}
      {product?.shortDescription && (
        <h2 className="text-gray-600 text-sm line-clamp-3 md:line-clamp-4">
          {product.shortDescription}
        </h2>
      )}
      {(product?.salePrice || product?.price) && (
        <h3 className="text-green-500 font-bold text-lg">
          {product?.salePrice && `LKR ${product.salePrice} `}
          {product?.price && (
            <span className="line-through text-gray-700 text-sm">
              LKR {product.price}
            </span>
          )}
        </h3>
      )}
      <div className="flex flex-wrap items-center gap-4">
        {product?.id && (
          <Link href={`/checkout?type=buynow&productId=${product.id}`}>
            <button className="bg-red-600 hover:bg-transparent hover:text-black border-2 border-red-600 text-white rounded-xl px-4 py-1.5">
              Rent Now
            </button>
          </Link>
        )}
        {product?.id && (
          <AuthContextProvider>
            <AddToCartButton type={"cute"} productId={product.id} />
          </AuthContextProvider>
        )}
        {product?.id && (
          <AuthContextProvider>
            <FavoriteButton productId={product.id} />
          </AuthContextProvider>
        )}
      </div>
      {product?.stock !== undefined && product?.orders !== undefined && product?.stock <= (product?.orders ?? 0) && (
        <div className="flex">
          <h3 className="text-red-500 py-1 rounded-lg text-sm font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}
      {product?.description && (
        <div className="flex flex-col gap-2 py-2">
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
        </div>
      )}
      
      {/* Add the new ProductLinks component only if links exist */}
      {product?.links && Array.isArray(JSON.parse(product.links || '[]')) && 
        JSON.parse(product.links || '[]').length > 0 && (
        <ProductLinks links={product.links} />
      )}
    </div>
  );
}

async function Category({ categoryId }) {
  try {
    const category = await getCategory({ id: categoryId });
    if (!category || !category.name) return null;
    
    return (
      <Link href={`/categories/${categoryId}`}>
        <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
          {category.imageURL && <img className="h-4" src={category.imageURL} alt="" />}
          <h4 className="text-xs font-semibold">{category.name}</h4>
        </div>
      </Link>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function Brand({ brandId }) {
  try {
    const brand = await getBrand({ id: brandId });
    if (!brand || !brand.name) return null;
    
    return (
      <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
        {brand.imageURL && <img className="h-4" src={brand.imageURL} alt="" />}
        <h4 className="text-xs font-semibold">{brand.name}</h4>
      </div>
    );
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

async function RatingReview({ product }) {
  try {
    const counts = await getProductReviewCounts({ productId: product?.id });
    if (!counts || (counts.totalReviews === 0 && counts.averageRating === 0)) {
      return null;
    }
    
    return (
      <div className="flex gap-3 items-center">
        <MyRating value={counts?.averageRating ?? 0} />
        <h1 className="text-sm text-gray-400">
          <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews})
        </h1>
      </div>
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}