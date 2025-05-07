"use client";

import { FaGoogle, FaPhone } from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { MdEmail, MdLocationOn } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFooterSettings } from "../services/settings";

export default function Footer() {
  // Default phone numbers and email
  const [phoneNumbers, setPhoneNumbers] = useState({
    "JaEla": [
      "(+94) 70 300 9000",
      "(+94) 76 300 9000",
      "(+94) 70 400 9005"
    ],
    "Kurunegala": [
      "(+94) 70 400 9000",
      "(+94) 76 400 9000"
    ],
    "Colombo": [
      "(+94) 72 500 9000"
    ]
  });
  
  const [email, setEmail] = useState("asdcameralk@gmail.com");
  
  // Fetch settings from Firebase
  const { data, error, isLoading } = useFooterSettings();
  
  // Update state when settings are loaded
  useEffect(() => {
    if (data) {
      setPhoneNumbers(data.phoneNumbers || phoneNumbers);
      setEmail(data.email || email);
    }
  }, [data]);

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
                  {Object.entries(phoneNumbers).map(([location, numbers]) => (
                    <div key={location} className="ml-1">
                      <p className="flex items-center gap-2 font-semibold text-sm">
                        <MdLocationOn className="text-red-500" />
                        {location}
                      </p>
                      {numbers.map((number, index) => (
                        <p key={index} className="flex items-center gap-2 text-sm ml-5 mt-1">
                          <FaPhone className="text-xs" />
                          {number}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="flex items-center gap-2 mt-2">
                  <MdEmail />
                  {email}
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