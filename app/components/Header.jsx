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
import { usePathname } from "next/navigation";
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
  const pathname = usePathname(); // Get current path
  const [isScrolled, setIsScrolled] = useState(false);
  
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

  // Handle scroll event to hide/show header
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Get settings from hook
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
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-md sm:py-1 px-3 sm:px-4 md:py-1 md:px-6 lg:px-16 border-b-2 transition-all duration-300 ${
        isScrolled ? "transform -translate-y-full" : "transform translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center z-10">
          <Link className="flex flex-row gap-1 sm:gap-2 shrink-0" href={"/"}>
            <img className="h-8 sm:h-10 md:h-12 lg:h-14" src="/logo1.png" alt="Logo" />
            <img className="h-8 sm:h-10 md:h-12 lg:h-14" src="/f.png" alt="Logo" />
          </Link>
        </div>
        
        {/* Phone Number - Centered */}
        <div className="flex-1 flex justify-center">
          <motion.div
            key={`phone-${displayedPhoneIndex}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-medium text-red-900 items-center hidden sm:flex"
          >
            <Phone size={18} className="mr-1" />
            <span className="text-sm md:text-base">
              {phoneNumbers[displayedPhoneIndex] || phoneNumbers[0]}
            </span>
          </motion.div>
        </div>

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
      </div>
    </motion.nav>
  );
}