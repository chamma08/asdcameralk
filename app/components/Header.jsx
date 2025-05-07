"use client";

import { Heart, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AuthContextProvider from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";
import { useRouter } from "next/navigation";
import algoliasearch from "algoliasearch/lite";

export default function Header() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef(null);

  const menuList = [
    {
      name: "Home",
      link: "/",
    },
    /* {
      name: "Products",
      link: "/shop",
    }, */
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact-us",
    },
  ];

  // Function to fetch suggestions from Algolia - using the same logic as the search page
  const getSuggestions = async (text) => {
    if (!text || text.trim() === "") {
      setSuggestions([]);
      return;
    }

    setShowSuggestions(true);
    
    try {
      const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
      );
      
      const search = await client.searchForHits({
        requests: [
          {
            indexName: "products",
            query: text,
            hitsPerPage: 6, // Limit suggestions to 6 items
          },
        ],
      });
      
      const hits = search.results[0]?.hits || [];
      console.log("Suggestion results:", hits); // For debugging
      setSuggestions(hits);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Debounce function for search input
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      if (query.trim() !== "") {
        getSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search?q=${query}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Navigate to product specific page or search results
    router.push(`/search?q=${encodeURIComponent(suggestion.title || suggestion.name)}`);
    setQuery(suggestion.title || suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="sticky top-0 z-50 bg-white bg-opacity-65 backdrop-blur-2xl py-3 px-4 md:py-4 md:px-16 border-b flex items-center justify-between"
    >
      <Link href={"/"}>
        <img className="h-10 md:h-8" src="/logo.png" alt="Logo" />
      </Link>
      <div className="hidden md:flex gap-2 items-center font-semibold">
        {menuList?.map((item, index) => {
          return (
            <Link href={item?.link} key={index}>
              <button className="text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
                {item?.name}
              </button>
            </Link>
          );
        })}
      </div>
      
      <div className="relative flex-grow mx-4 max-w-md" ref={suggestionsRef}>
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center"
        >
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (query && query.trim() !== "") {
                getSuggestions(query);
                setShowSuggestions(true);
              }
            }}
            placeholder="Search products..."
            type="text"
            className="border w-full px-4 py-2 rounded-xl bg-white focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-black text-white rounded-xl text-sm flex items-center"
          >
            Search
          </button>
        </form>

        {/* {showSuggestions && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="py-2 px-4 bg-gray-50 text-sm text-gray-700 font-medium border-b">Product Suggestions</div>
            
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-0"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title || item.name} 
                      className="h-16 w-16 object-contain mr-4 rounded bg-white border p-1" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-product.png"; // Fallback to placeholder
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                      <span className="text-gray-400 text-xs text-center">No image</span>
                    </div>
                  )}
                  <div className="font-medium text-base overflow-hidden">
                    <div className="line-clamp-2">{item.title || item.name}</div>
                  </div>
                </div>
              ))
            ) : query.trim() !== "" ? (
              <div className="p-4 text-center text-gray-500">No products found</div>
            ) : null}
          </div>
        )} */}
      </div>

      <div className="flex items-center gap-1">
        <AuthContextProvider>
          <AdminButton />
        </AuthContextProvider>
        <AuthContextProvider>
          <HeaderClientButtons />
        </AuthContextProvider>
        <Link href={`/login`}>
          <button
            title="My Account"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <UserCircle2 size={16} />
          </button>
        </Link>
        <AuthContextProvider>
          <LogoutButton />
        </AuthContextProvider>
      </div>
    </motion.nav>
  );
}