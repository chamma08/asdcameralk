"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AuthContextProvider from "@/context/AuthContext"; 
import { useRouter } from "next/navigation";
import { algoliasearch } from "algoliasearch";
import { Search } from "lucide-react"; 
import LogoutButton from "./LogoutButton"; 
import HeaderClientButtons from "./HeaderClientButtons"; // Added
import AdminButton from "./AdminButton"; // Added
import { UserCircle2 } from "lucide-react"; // Added for My Account icon


export default function NavBar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setShowMobileSearch(false);
      }
    };
    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSuggestions = async (text) => {
    if (!text || text.trim() === "") {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
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
            hitsPerPage: 6,
          },
        ],
      });
      const hits = search.results[0]?.hits || [];
      setSuggestions(hits);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key to close mobile search and suggestions (mobile menu part removed)
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showMobileSearch) setShowMobileSearch(false);
        // if (showMobileMenu) setShowMobileMenu(false); // Removed
        if (showSuggestions) setShowSuggestions(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    // Removed showMobileMenu from dependencies
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [showMobileSearch, showSuggestions]);

  // Removed useEffect for mobileMenuRef (outside click for menuList's mobile menu)

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setShowMobileSearch(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    router.push(
      `/search?q=${encodeURIComponent(suggestion.title || suggestion.name)}`
    );
    setQuery(suggestion.title || suggestion.name);
    setShowSuggestions(false);
    setShowMobileSearch(false);
  };

  

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="sticky top-0 z-50 bg-white bg-opacity-65 h-12 backdrop-blur-2xl py-2 sm:py-3 px-3 sm:px-4 md:py-4 md:px-6 lg:px-16 border-b flex items-center justify-between gap-2 md:gap-4 lg:gap-6 transition-all duration-300"
      // Changed justify-between to justify-center and added relative positioning
    >
      
      {/* Centered Search Bar Container */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md lg:max-w-[600px] px-16 sm:px-20 hidden sm:block" // Changed: max-w-xs sm:max-w-sm lg:max-w-md  TO  max-w-md lg:max-w-lg
        ref={suggestionsRef}
      >
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim() !== "") {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => {
              if (query && query.trim() !== "") {
                getSuggestions(query);
                setShowSuggestions(true);
              }
            }}
            placeholder="Search for products"
            type="text"
            className="w-full pl-3 pr-10 py-1.5 text-xs sm:text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
          />
          <button
            type="submit"
            className="absolute right-0 flex items-center justify-center bg-red-600 text-white rounded-full"
            style={{
              width: "28px",
              height: "28px",
              right: "2px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Search size={14} />
          </button>
        </form>

        {showSuggestions && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="py-1.5 px-3 bg-gray-50 text-xs text-gray-700 font-medium border-b">
              Product Suggestions
            </div>
            {isLoading ? (
              <div className="p-3 text-center">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-0"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.featureImageURL ? (
                    <img
                      src={item.featureImageURL}
                      alt={item.title || item.name}
                      className="h-8 w-8 sm:h-10 sm:w-10 object-contain mr-2 sm:mr-3 rounded bg-white border p-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-100 flex items-center justify-center rounded mr-2 sm:mr-3">
                      <span className="text-gray-400 text-xs text-center">
                        No img
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-800 flex-1 min-w-0">
                    <div className="font-medium line-clamp-2">
                      {item.title || item.name}
                    </div>
                    {item.price && (
                      <div className="text-gray-600 mt-0.5">${item.price}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 text-xs">
                No products found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Button - Positioned on the left */}
      <div className="absolute left-3 sm:left-4 md:left-6 lg:left-16 sm:hidden">
        <button
          className="flex h-8 w-8 justify-center items-center rounded-full hover:bg-gray-50 transition-colors z-10"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </div>
      
      {/* User Account Buttons - Positioned on the right */}
      <div className="absolute right-3 sm:right-4 md:right-6 lg:right-16 flex items-center gap-1 z-10 shrink-0">
          <AuthContextProvider>
            <AdminButton />
          </AuthContextProvider>
          <AuthContextProvider>
            <HeaderClientButtons />
          </AuthContextProvider>
          <Link href={`/login`}>
            <button
              title="My Account"
              className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50 transition-colors"
            >
              <UserCircle2 size={16} />
            </button>
          </Link>
          <AuthContextProvider>
            <LogoutButton />
          </AuthContextProvider>
        </div>


      {/* Removed Mobile Menu Dropdown (for menuList) */}

      {/* Full-width Mobile Search - Kept */}
      {showMobileSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          // Adjusted z-index, ensure it appears correctly
          className="absolute left-0 right-0 top-full bg-white border-b py-3 px-4 sm:hidden z-30" // z-30, potentially below Header's mobile menu if both open
        >
          <div className="relative" ref={suggestionsRef}> {/* Re-using suggestionsRef here, ensure it's okay or use a different one if mobile search needs distinct ref */}
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setShowMobileSearch(false);
              }}
              className="relative flex items-center"
            >
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setShowSuggestions(true);
                  }
                }}
                onFocus={() => {
                  if (query && query.trim() !== "") {
                    getSuggestions(query);
                    setShowSuggestions(true);
                  }
                }}
                autoFocus
                placeholder="Search for products"
                type="text"
                className="w-full pl-3 pr-10 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
              />
              <button
                type="submit"
                className="absolute right-0 flex items-center justify-center bg-red-600 text-white rounded-full"
                style={{
                  width: "28px",
                  height: "28px",
                  right: "2px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <Search size={16} />
              </button>
            </form>

            {showSuggestions && ( // This is the same suggestions dropdown logic as desktop
              <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {/* ... suggestions rendering ... (same as desktop) */}
                 <div className="py-1.5 px-3 bg-gray-50 text-xs text-gray-700 font-medium border-b">
                  Product Suggestions
                </div>

                {isLoading ? (
                  <div className="p-3 text-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-0"
                      onClick={() => {
                        handleSuggestionClick(item);
                        setShowMobileSearch(false); // Close mobile search as well
                      }}
                    >
                      {item.featureImageURL ? (
                        <img
                          src={item.featureImageURL}
                          alt={item.title || item.name}
                          className="h-10 w-10 object-contain mr-3 rounded bg-white border p-1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-product.png";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded mr-3">
                          <span className="text-gray-400 text-xs text-center">
                            No img
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-800 flex-1 min-w-0">
                        <div className="font-medium line-clamp-2">
                          {item.title || item.name}
                        </div>
                        {item.price && (
                          <div className="text-gray-600 mt-0.5">
                            ${item.price}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-xs">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}