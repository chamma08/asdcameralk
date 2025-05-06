"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, CheckCircle, XCircle } from "lucide-react";

const Redbar = () => {
  const phoneNumbers = [
    "011 2 687 687",
    "011 2 687 688",
    "077 7 687 687"
  ];
  
  const [isOpen, setIsOpen] = useState(true);
  const [displayedPhoneIndex, setDisplayedPhoneIndex] = useState(0);
  
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedPhoneIndex((prevIndex) => 
        prevIndex === phoneNumbers.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [phoneNumbers.length]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-50 bg-[#FF0000] backdrop-blur-2xl py-2 w-full relative text-white overflow-hidden"
    >
      {/* Centered phone number */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center">
        <Phone size={18} className="mr-1" />
        <motion.div 
          key={`phone-${displayedPhoneIndex}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="font-medium"
        >
          {phoneNumbers[displayedPhoneIndex]}
        </motion.div>
      </div>
      
      {/* Scrolling text container */}
      <div className="w-full h-8 overflow-hidden relative">
        <motion.div
          animate={{
            x: ["-100%", "1000%"]
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
              <span className="font-medium">WE ARE OPEN NOW</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="mr-1" />
              <span className="font-medium">WE ARE CLOSED NOW</span>
            </>
          )}
        </motion.div>

        {/* Block space for centered phone number */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 bg-[#FF0000] h-full w-48 z-10"></div>
      </div>
    </motion.nav>
  );
};

export default Redbar;
