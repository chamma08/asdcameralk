"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, CheckCircle, XCircle } from "lucide-react";
import { useRedbarSettings } from "../services/settings";

const Redbar = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([
    "011 2 687 687",
    "011 2 687 688",
    "077 7 687 687"
  ]);
  
  const [openText, setOpenText] = useState("WE ARE OPEN NOW");
  const [closedText, setClosedText] = useState("WE ARE CLOSED NOW");
  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [displayedPhoneIndex, setDisplayedPhoneIndex] = useState(0);
  
  // Use our settings hook to fetch data
  const { data } = useRedbarSettings();
  
  // Update state when settings are loaded
  useEffect(() => {
    if (data) {
      setOpenText(data.openText || "WE ARE OPEN NOW");
      setClosedText(data.closedText || "WE ARE CLOSED NOW");
      setPhoneNumbers(data.phoneNumbers || [
        "011 2 687 687",
        "011 2 687 688",
        "077 7 687 687"
      ]);
      setIsVisible(data.isVisible !== undefined ? data.isVisible : true);
    }
  }, [data]);
  
  // Check if shop is open based on time
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const hours = now.getHours();
      const day = now.getDay();

      if (day === 0) {
        setIsOpen(false);
      } else if (day === 6) {
        setIsOpen(hours >= 9 && hours < 13);
      } else {
        setIsOpen(hours >= 9 && hours < 18);
      }
    };
    
    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Rotate through phone numbers
  useEffect(() => {
    if (phoneNumbers.length <= 1) return;
    
    const interval = setInterval(() => {
      setDisplayedPhoneIndex((prevIndex) => 
        prevIndex === phoneNumbers.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [phoneNumbers.length]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-50 bg-[#FF0000] backdrop-blur-2xl py-2 w-full relative text-white overflow-hidden"
    >
      
      
      {/* Scrolling text container */}
      <div className="w-full h-8 overflow-hidden relative">
        <motion.div
          animate={{
            x: ["900%", "-90%"]
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity
          }}
          className="absolute flex items-center whitespace-nowrap top-1 transform -translate-y-1/2 left-0"
        >
          {isOpen ? (
            <>
              <CheckCircle size={16} className="mr-1" />
              <span className="font-medium">{openText}</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="mr-1" />
              <span className="font-medium">{closedText}</span>
            </>
          )}
        </motion.div>

        {/* Block space for centered phone number */}
        {/* <div className="absolute left-1/2 top-0 transform -translate-x-1/2 bg-[#FF0000] h-full w-48 z-10"></div> */}
      </div>
    </motion.nav>
  );
};

export default Redbar;