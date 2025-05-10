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
import { algoliasearch } from "algoliasearch";

export default function Header() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef(null);

  const menuList = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact-us" },
  ];

  // Use searchForHits to match the page.jsx implementation
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

      // Use searchForHits to match the page.jsx implementation
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
      
      // Debug logs
      console.log("Algolia query:", text);
      console.log("Algolia results:", search);
      console.log("Algolia hits:", hits);
      
      // Check image field names in the first result
      if (hits.length > 0) {
        console.log("First hit fields:", Object.keys(hits[0]));
      }

      setSuggestions(hits);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce user input
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

  // Close dropdown on outside click
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
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
        {menuList.map((item, index) => (
          <Link href={item.link} key={index}>
            <button className="text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
              {item.name}
            </button>
          </Link>
        ))}
      </div>

      {/* Search & Suggestions */}
      <div className="relative flex-grow mx-4 max-w-md" ref={suggestionsRef}>
        <form onSubmit={handleSubmit} className="flex w-full items-center">
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

        {showSuggestions && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="py-2 px-4 bg-gray-50 text-sm text-gray-700 font-medium border-b">
              Product Suggestions
            </div>

            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-0"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.featureImageURL ? (
                    <img
                      src={item.featureImageURL}
                      alt={item.title || item.name}
                      className="h-12 w-12 object-contain mr-4 rounded bg-white border p-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded mr-4">
                      <span className="text-gray-400 text-xs text-center">
                        No image
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-800">
                    <div className="font-medium line-clamp-2">
                      {item.title || item.name}
                    </div>
                    {item.price && (
                      <div className="text-gray-600 mt-1">${item.price}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        )}
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