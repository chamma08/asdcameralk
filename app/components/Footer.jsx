"use client";

import { FaGoogle, FaPhone } from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
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
                <p className="flex items-center gap-2">
                  <FaPhone />
                  070 000 0000/076 000 0000
                </p>
                <p className="flex items-center gap-2 mt-2">
                  {" "}
                  <MdEmail />
                  matheeshacham08@gmail.com
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
                <img
                  src="/c1.png"
                  alt="payment"
                  className="w-[80%]"
                />
              </div>
            </motion.div>
          </div>
          <p className="text-center mt-8 border-t-2 border-black pt-8">
            © 2025 . All Rights Reserved | Matheesha Dissanayake
          </p>
        </div>
      </footer>
    </>
  );
}
