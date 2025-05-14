"use client";

import {
  Heart,
  ShoppingCart,
  UserCircle2,
  Search,
  Menu,
  X,
  Phone,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AuthContextProvider from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";
import { useRouter } from "next/navigation";
import { algoliasearch } from "algoliasearch";
import { useRedbarSettings } from "../services/settings";

export default function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  // Phone number rotation
  const [phoneNumbers, setPhoneNumbers] = useState([
    "011 2 687 687",
    "011 2 687 688",
    "077 7 687 687",
  ]);
  const [displayedPhoneIndex, setDisplayedPhoneIndex] = useState(0);
  
  // Set up phone number rotation
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedPhoneIndex((prevIndex) => 
        (prevIndex + 1) % phoneNumbers.length
      );
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [phoneNumbers.length]);

  const menuList = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact-us" },
  ];

  // Track viewport width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      
      // Auto-close mobile menu and search on resize to desktop
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
        setShowMobileSearch(false);
      }
    };
    
    // Set initial width
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Handle escape key to close mobile search and menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showMobileSearch) setShowMobileSearch(false);
        if (showMobileMenu) setShowMobileMenu(false);
        if (showSuggestions) setShowSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [showMobileSearch, showMobileMenu, showSuggestions]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMobileMenu]);

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

  // Use our settings hook to fetch data
  const { data } = useRedbarSettings();

  useEffect(() => {
    if (data) {
      setPhoneNumbers(
        data.phoneNumbers || ["011 2 687 687", "011 2 687 688", "077 7 687 687"]
      );
    }
  }, [data]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="sticky top-0 z-50 bg-white bg-opacity-65 backdrop-blur-2xl py-2 sm:py-3 px-3 sm:px-4 md:py-4 md:px-6 lg:px-16 border-b flex items-center justify-between"
    >
      {/* Logo and Phone Number Section */}
      <div className="flex items-center z-10">
        <Link className="flex flex-row gap-1 sm:gap-2 shrink-0" href={"/"}>
          <img className="h-8 sm:h-10 md:h-12 lg:h-14" src="/logo1.png" alt="Logo" />
          <img className="h-8 sm:h-10 md:h-12 lg:h-14" src="/f.png" alt="Logo" />
        </Link>
        
        {/* Phone Number - Next to logos */}
        <motion.div
          key={`phone-${displayedPhoneIndex}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="hidden sm:flex font-medium text-red-900 items-center ml-4 md:ml-6"
        >
          <Phone size={18} className="mr-1" />
          <span className="text-sm md:text-base">
            {phoneNumbers[displayedPhoneIndex] || phoneNumbers[0]}
          </span>
        </motion.div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-1 lg:gap-2 items-center font-semibold">
        {menuList.map((item, index) => (
          <Link href={item.link} key={index}>
            <button className="text-xs lg:text-sm px-2 lg:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              {item.name}
            </button>
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex h-8 w-8 justify-center items-center rounded-full hover:bg-gray-50 transition-colors z-10"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Menu"
      >
        {showMobileMenu ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Search & Suggestions - Hidden on xs screens, visible from sm up */}
      <div
        className="relative flex-grow mx-2 sm:mx-4 max-w-xs sm:max-w-sm lg:max-w-md hidden sm:block"
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

      {/* Mobile Search Button */}
      <button
        className="sm:hidden flex h-8 w-8 justify-center items-center rounded-full hover:bg-gray-50 transition-colors z-10"
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        aria-label="Search"
      >
        <Search size={16} />
      </button>

      {/* User Account Buttons - Responsive sizing */}
      <div className="flex items-center gap-1 z-10 shrink-0">
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

      {/* Mobile Menu Dropdown - Improved animation and styling */}
      {showMobileMenu && (
        <motion.div
          ref={mobileMenuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full bg-white border-b shadow-lg z-40 md:hidden"
        >
          {/* Mobile phone number at top of menu */}
          <div className="sm:hidden border-b">
            <div className="flex items-center justify-center py-3 bg-gray-50">
              <Phone size={16} className="text-red-600 mr-2" />
              <motion.div
                key={`phone-menu-${displayedPhoneIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                {phoneNumbers[displayedPhoneIndex] || phoneNumbers[0]}
              </motion.div>
            </div>
          </div>
          
          <div className="py-2 px-4">
            {menuList.map((item, index) => (
              <Link
                href={item.link}
                key={index}
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="py-2.5 border-b last:border-0 text-sm font-medium hover:bg-gray-50 px-3 rounded transition-colors">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full-width Mobile Search - Only shows when activated */}
      {showMobileSearch && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full bg-white border-b py-3 px-4 sm:hidden z-40"
        >
          <div className="relative" ref={suggestionsRef}>
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
                      onClick={() => {
                        handleSuggestionClick(item);
                        setShowMobileSearch(false);
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