"use client";

import { ProductCard } from "@/app/components/Products";
import { algoliasearch } from "algoliasearch";
import SearchBox from "./components/SearchBox";
import { motion } from "framer-motion";

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
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.5,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };
};

const getProducts = async (text) => {
  if (!text) {
    return [];
  }
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
  );
  const search = await client.searchForHits({
    requests: [
      {
        indexName: "products",
        query: text,
        hitsPerPage: 20,
      },
    ],
  });
  const hits = search.results[0]?.hits;
  return hits ?? [];
};

// Get featured or recommended products to display when no search results
const getFeaturedProducts = async () => {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
  );
  const search = await client.searchForHits({
    requests: [
      {
        indexName: "products",
        query: "",
        hitsPerPage: 4,  // Changed from 8 to 4
      },
    ],
  });
  const hits = search.results[0]?.hits;
  return hits ?? [];
};

export default async function Page({ searchParams }) {
  const q = searchParams?.q || "";
  const products = await getProducts(q);
  const featuredProducts = q ? await getFeaturedProducts() : [];

  return (
    <main className="flex flex-col gap-5 min-h-screen p-5">
      {/* <SearchBox /> */}
      {/* <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-xs text-gray-500">Powered By</h1>
        <img src="/algolia.png" className="h-5" alt="Algolia Logo" />
      </div> */}
      
      {/* Search Results Section */}
      <div className="w-full flex justify-center">
        <div className="flex flex-col gap-5 max-w-[900px] p-5 w-full">
          {q && (
            <motion.h1 
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="show"
              className="text-center font-semibold text-lg"
            >
              Products for "{q}"
            </motion.h1>
          )}

          {/* No Products Message */}
          {q && products?.length === 0 && (
            <motion.div 
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <img 
                src="/no-results.svg" 
                alt="No Products" 
                className="h-32 w-32 mb-4 opacity-70"
                onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=No+Results"}}
              />
              <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
              <p className="text-gray-500 mt-2">We couldn't find any products matching "{q}"</p>
              <p className="text-gray-500 mt-1">Try using different keywords or check out our available products below</p>
            </motion.div>
          )}

          {/* Search Results Grid */}
          {products?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products?.map((item) => {
                return <ProductCard product={item} key={item?.id} />;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Available Products Section - Show when no search results or as additional content */}
      {(products?.length === 0 || featuredProducts.length > 0) && (
        <section className="w-full flex justify-center mt-8 border-t pt-8">
          <div className="flex flex-col gap-5 max-w-[1200px] p-5 w-full">
            <motion.h1
              variants={fadeUp(0.4)}
              initial="hidden"
              whileInView="show"
              className="text-center font-semibold text-lg"
            >
              {q ? "Available Products" : "Featured Products"}
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {featuredProducts.length > 0 ? (
                featuredProducts?.slice(0, 4).map((item) => (  // Added slice(0, 4) to ensure only 4 products are shown
                  <ProductCard product={item} key={item?.id} />
                ))
              ) : (
                // Placeholder for loading state
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-500">Loading available products...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}