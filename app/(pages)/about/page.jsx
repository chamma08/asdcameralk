"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Clock, Users, Award, Zap, Shield } from "lucide-react";
import Link from "next/link";

const page = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const stats = [
    { number: "15+", label: "Years of Excellence", icon: Award },
    { number: "24/7", label: "Service Available", icon: Clock },
    { number: "1000+", label: "Happy Clients", icon: Users },
    { number: "100%", label: "Reliable Service", icon: Shield },
  ];

  const services = [
    {
      title: "Camera Equipment Rental",
      description:
        "Professional cameras and videography equipment for all your creative needs",
      icon: Camera,
    },
    {
      title: "Photographer Supply",
      description:
        "Skilled photographers ready to capture your perfect moments",
      icon: Users,
    },
    {
      title: "Videographer Services",
      description:
        "Expert videographers for films, TV, advertising, and events",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/i.jpg')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90"></div>
        {/*  <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-red-500 rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-500 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 right-10 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 border border-white rounded-full"></div>
        </div> */}
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          className="container mx-auto px-6 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-white">ASD</span>
                <span className="text-red-500 ml-4">Camera Rent</span>
              </h1>
            </motion.div>

            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              Empowering creativity through professional camera equipment and
              expert services since 2010
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-1 bg-red-500 mx-auto"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 border border-red-500 rounded-full transform rotate-12"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-black rounded-lg transform -rotate-12 opacity-10"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 border-2 border-gray-400 rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-red-500 transform rotate-45"></div>
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <stat.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-black to-transparent rounded-full transform -translate-x-40 translate-y-40"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 border-2 border-gray-300 rounded-full opacity-30"></div>
            <div className="absolute inset-8 border border-red-300 rounded-full"></div>
            <div className="absolute inset-16 bg-black rounded-full opacity-10"></div>
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                About <span className="text-red-500">Our Story</span>
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-black text-white p-8 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-4 text-red-500">
                    Since 2010
                  </h3>
                  <p className="text-lg leading-relaxed">
                    <strong className="text-red-400">ASD Camera Rent</strong> is
                    a premier company providing camera & videography equipment
                    and photographer & videographer supply services in Sri Lanka
                    since 2010.
                  </p>
                </div>

                <div className="bg-red-500 text-white p-8 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-4">
                    Trusted Partnership
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Operating as an affiliate under{" "}
                    <strong>Vimukthi Holdings Company</strong>, we've been
                    providing services to award-winning film producers,
                    television programmers, advertising agencies, and creative
                    professionals across Sri Lanka.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <Clock className="w-8 h-8 text-red-500 mr-3" />
                    <h3 className="text-2xl font-bold text-black">
                      24/7 Availability
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our operations and services are available{" "}
                    <strong className="text-red-500">
                      24 hours a day & 7 days every week
                    </strong>
                    , delivering instant solutions to your continuing needs.
                  </p>
                </div>

                <div className="bg-black text-white p-8 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-4 text-red-500">
                    Our Commitment
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Our goal is to provide services in a{" "}
                    <strong>
                      consistent, reliable, unmatched and flexible manner
                    </strong>{" "}
                    to all our valued customers.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-red-500 rounded-full transform -rotate-12"></div>
          <div className="absolute top-40 right-32 w-32 h-32 border-4 border-black rounded-lg transform rotate-45"></div>
          <div className="absolute bottom-32 left-1/4 w-48 h-48 border-2 border-red-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-black transform rotate-12 rounded-lg"></div>
          <div className="absolute top-1/2 left-10 w-20 h-20 border border-gray-400 rounded-full"></div>
          <div className="absolute top-1/3 right-10 w-24 h-24 bg-red-500 rounded-full opacity-20"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Our <span className="text-red-500">Services</span>
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-red-500"
              >
                <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4 group-hover:text-red-500 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-1/4 w-64 h-64 border border-red-500 rounded-full transform rotate-45"></div>
            <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-red-500 rounded-full opacity-20 transform -rotate-12"></div>
            <div className="absolute top-1/2 left-10 w-32 h-32 border-2 border-white rounded-lg transform rotate-12"></div>
            <div className="absolute top-20 right-20 w-40 h-40 border border-white rounded-full"></div>
            <div className="absolute bottom-32 left-20 w-24 h-24 bg-white rounded-full opacity-30"></div>
          </div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create{" "}
              <span className="text-red-500">Something Amazing?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let us help you bring your vision to life with our professional
              equipment and expert services.
            </p>
            <Link href="/contact-us">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default page;
