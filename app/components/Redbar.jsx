"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Clock, CheckCircle, XCircle } from "lucide-react";

const Redbar = () => {
  // Mock data - in a real app, this would come from your backend
  const phoneNumbers = [
    "011 2 687 687",
    "011 2 687 688",
    "077 7 687 687"
  ];
  
  const [isOpen, setIsOpen] = useState(true);
  const [displayedPhoneIndex, setDisplayedPhoneIndex] = useState(0);
  
  // Check if store is open based on current time
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const hours = now.getHours();
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      
      // Assuming open Mon-Fri 9AM-6PM, Sat 9AM-1PM, closed on Sunday
      if (day === 0) {
        setIsOpen(false);
      } else if (day === 6) { // Saturday
        setIsOpen(hours >= 9 && hours < 13);
      } else { // Weekdays
        setIsOpen(hours >= 9 && hours < 18);
      }
    };
    
    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Cycle through phone numbers every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedPhoneIndex((prevIndex) => 
        prevIndex === phoneNumbers.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change number every 5 seconds
    
    return () => clearInterval(interval);
  }, [phoneNumbers.length]);
  
  // Animation variants for the typing effect
  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.05
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-50 bg-[#FF0000] backdrop-blur-2xl py-2 px-4 md:py-3 md:px-16 flex justify-between items-center text-white"
    >
      <div className="flex flex-1 justify-start">
        {/* Phone number with icon and typing animation */}
        <div className="flex items-center">
          <Phone size={18} className="mr-2" />
          <motion.div 
            key={`phone-${displayedPhoneIndex}`}
            className="flex"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
          >
            {phoneNumbers[displayedPhoneIndex].split('').map((char, index) => (
              <motion.span
                key={`char-${index}`}
                variants={letterVariants}
                className="font-medium"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Updated Open/Closed status indicator with icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className={`text-sm font-medium px-3 py-1 rounded flex items-center ${
          isOpen 
            ? "bg-green-600 text-white" 
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {isOpen ? (
          <>
            <CheckCircle size={16} className="mr-1" />
            <span>WE ARE OPEN NOW</span>
          </>
        ) : (
          <>
            <XCircle size={16} className="mr-1" />
            <span>WE ARE CLOSED NOW</span>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
};

export default Redbar;