"use client";

import {
  Phone, 
  Menu, 
  X, 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { useRedbarSettings } from "../services/settings";

export default function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false); 
  const [showMobileMenu, setShowMobileMenu] = useState(false); 
  const mobileMenuRef = useRef(null); 
  const router = useRouter(); 
  const [viewportWidth, setViewportWidth] = useState(0); 
  const pathname = usePathname(); 
  const [isScrolled, setIsScrolled] = useState(false); 

  const [phoneNumbers, setPhoneNumbers] = useState([
    "011 2 687 687",
    "011 2 687 688",
    "077 7 687 687",
  ]);
  const [displayedPhoneIndex, setDisplayedPhoneIndex] = useState(0);

  const menuList = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Blog", link: "/blog" },
    { name: "Our Clients", link: "/clients" },
    { name: "Promotions", link: "/promotions" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const isActiveLink = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedPhoneIndex((prevIndex) =>
        (prevIndex + 1) % phoneNumbers.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [phoneNumbers.length]);

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

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false); 
        setShowMobileSearch(false); 
      }
    };

    handleResize(); 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data } = useRedbarSettings();

  useEffect(() => {
    if (data) {
      setPhoneNumbers(
        data.phoneNumbers || ["011 2 687 687", "011 2 687 688", "077 7 687 687"]
      );
    }
  }, [data]);

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
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showMobileMenu) setShowMobileMenu(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [showMobileMenu]);


  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`top-0 z-50 bg-white bg-opacity-90 backdrop-blur-md sm:py-1 px-3 sm:px-4 md:py-1 md:px-6 lg:px-16 border-b-1 transition-all duration-300 ${
          isScrolled ? "transform -translate-y-full" : "transform translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center z-10">
            <Link className="flex flex-row gap-1 sm:gap-2 shrink-0" href={"/"}>
              <img className="h-8 sm:h-10 md:h-12 lg:h-14" src="/logo1.png" alt="Logo" />
              <img className="h-10 sm:h-10 md:h-12 lg:h-16" src="/f.png" alt="Logo" />
            </Link>
          </div>

          {/* MenuList - Centered with wider background */}
          <div className="hidden md:flex flex-1 justify-center items-center"> 
            {/* This inner div is the actual menu bar with background and padding. py-1 REMOVED. */}
            <div className="flex gap-1 lg:gap-2 items-center font-semibold bg-gray-100 rounded-full"> 
              {menuList.map((item, index) => (
                <Link href={item.link} key={index}>
                  <button
                    className={`text-xs lg:text-sm px-2 lg:px-4 py-2 rounded-full transition-colors ${
                      isActiveLink(item.link)
                        ? "bg-red-600 text-white rounded-full" 
                        : "hover:bg-red-200 hover:rounded-full" 
                    }`}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button for menuList */}
          <div className="md:hidden flex items-center z-10"> 
            <button
              className="flex h-8 w-8 justify-center items-center rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Menu"
            >
              {showMobileMenu ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {/* Phone Number - Moved to the right */}
          <div className="items-center gap-1 z-10 shrink-0 hidden sm:flex"> 
            <motion.div
              key={`phone-${displayedPhoneIndex}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="font-medium text-red-900 items-center flex"
            >
              <Phone size={18} className="mr-1" />
              <span className="text-sm md:text-base">
                {phoneNumbers[displayedPhoneIndex] || phoneNumbers[0]}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown for menuList */}
      {showMobileMenu && (
        <motion.div
          ref={mobileMenuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="sticky top-[57px] sm:top-[65px] md:top-[73px] lg:top-[79px] left-0 right-0 bg-white border-b shadow-lg z-40 md:hidden" 
        >
          <div className="py-2 px-4">
            {menuList.map((item, index) => (
              <Link
                href={item.link}
                key={index}
                onClick={() => setShowMobileMenu(false)}
              >
                <div
                  className={`py-2.5 border-b last:border-0 text-sm font-medium px-3 rounded transition-colors ${
                    isActiveLink(item.link)
                      ? "bg-red-100 text-red-700" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}