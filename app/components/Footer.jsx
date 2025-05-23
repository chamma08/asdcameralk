"use client";

import { FaGoogle, FaPhone } from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { MdEmail, MdLocationOn } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFooterSettings } from "../services/settings";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  // Default data
  const [footerData, setFooterData] = useState({
    phoneNumbers: {
      JaEla: ["(+94) 70 300 9000", "(+94) 76 300 9000", "(+94) 70 400 9005"],
      Kurunegala: ["(+94) 70 400 9000", "(+94) 76 400 9000"],
      Colombo: ["(+94) 72 500 9000"],
    },
    addresses: {
      JaEla: "123 Main Street, JaEla, Sri Lanka",
      Kurunegala: "456 Central Road, Kurunegala, Sri Lanka",
      Colombo: "789 Business Avenue, Colombo, Sri Lanka",
    },
    email: "asdcameralk@gmail.com",
  });

  // State for controlling which map to show
  const [showMap, setShowMap] = useState({});

  // Fetch settings from Firebase
  const { data, error, isLoading } = useFooterSettings();

  // Update state when settings are loaded
  useEffect(() => {
    if (data) {
      setFooterData({
        phoneNumbers: data.phoneNumbers || footerData.phoneNumbers,
        addresses: data.addresses || footerData.addresses,
        email: data.email || footerData.email,
      });
    }
  }, [data]);

  const toggleMap = (location) => {
    setShowMap(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  const getGoogleMapEmbedUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
  };

  const getGoogleMapStaticUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    // Using Google Static Maps API (you'll need to replace YOUR_API_KEY with actual key)
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=300x200&maptype=roadmap&markers=color:red%7C${encodedAddress}&key=YOUR_API_KEY`;
  };

  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };

  return (
    <>
      <footer className="bg-blue-100 z-50 pt-12 pb-8">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold">
                <span className="text-red-500 uppercase">ASD</span> Camera
              </h1>
              <p className="text-sm max-w-[300px]">
                We are the best camera service provider in Sri Lanka. We provide
                the best service for our customers.
              </p>
              <div className="space-y-4">
                {/* Contact Information - Dynamic from Firebase */}
                <div className="space-y-3">
                  {Object.entries(footerData.phoneNumbers).map(
                    ([location, numbers]) => (
                      <div key={location} className="ml-1">
                        <p className="flex items-center gap-2 font-semibold text-sm">
                          <MdLocationOn className="text-red-500" />
                          {location}
                        </p>
                        {footerData.addresses[location] && (
                          <div className="ml-5 mt-1 mb-2">
                            <div className="flex items-start gap-2 text-sm">
                              <FaMapMarkerAlt className="text-red-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="block mb-2">
                                  {footerData.addresses[location]}
                                </span>
                                <button
                                  onClick={() => toggleMap(location)}
                                  className="text-blue-600 hover:underline text-xs bg-blue-50 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  {showMap[location] ? "Hide Map" : "Show Map"}
                                </button>
                              </div>
                            </div>
                            
                            {/* Map Image */}
                            {showMap[location] && (
                              <div className="mt-3 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                {/* Option 1: Using Google Static Maps (requires API key) */}
                                {/* <img 
                                  src={getGoogleMapStaticUrl(footerData.addresses[location])}
                                  alt={`Map of ${location}`}
                                  className="w-full h-48 object-cover cursor-pointer"
                                  onClick={() => openGoogleMaps(footerData.addresses[location])}
                                /> */}
                                
                                {/* Option 2: Using OpenStreetMap (no API key required) */}
                                <div 
                                  className="w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                                  onClick={() => openGoogleMaps(footerData.addresses[location])}
                                >
                                  <div className="text-center">
                                    <FaMapMarkerAlt className="text-red-500 text-2xl mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-700">{location}</p>
                                    <p className="text-xs text-gray-600 mt-1">Click to view in Google Maps</p>
                                  </div>
                                </div>
                                
                                {/* Option 3: Embedded iframe (uncomment to use) */}
                                {/* <iframe
                                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798!2d79.856!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuNiJOIDc5wrA1MSczMy42IkU!5e0!3m2!1sen!2slk!4v1234567890123`}
                                  width="100%"
                                  height="200"
                                  style={{ border: 0 }}
                                  allowFullScreen=""
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                ></iframe> */}
                              </div>
                            )}
                          </div>
                        )}
                        {numbers.map((number, index) => (
                          <p
                            key={index}
                            className="flex items-center gap-2 text-sm ml-5 mt-1"
                          >
                            <FaPhone className="text-xs" />
                            {number}
                          </p>
                        ))}
                      </div>
                    )
                  )}
                </div>
                <p className="flex items-center gap-2 mt-2">
                  <MdEmail />
                  {footerData.email}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold uppercase">Quick Links</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <ul className="space-y-4">
                    <li>
                      <a href="#" className="text-sm">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm">
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-4">
                    <li>
                      <a href="#" className="text-sm">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm">
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold uppercase">Follow us On</h1>
              <div className="flex items-center gap-4 cursor-pointer">
                <FaFacebook className="text-3xl hover:scale-105 duration-300" />
                <FaInstagram className="text-3xl hover:scale-105 duration-300" />
                <FaGoogle className="text-3xl hover:scale-105 duration-300" />
              </div>
              <div className="space-y-2">
                <p>Payment Methods</p>
                <img src="/c1.png" alt="payment" className="w-[80%]" />
              </div>
            </motion.div>
          </div>
          <p className="text-center mt-8 border-t-2 border-black pt-8">
            AIRSTUDIOS © 2025 | Rights Reserved
          </p>
        </div>
      </footer>
    </>
  );
}