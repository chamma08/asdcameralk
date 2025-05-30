"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaGoogle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdSend } from 'react-icons/md';
import { useFooterSettings } from '@/app/services/settings';
import { FaLinkedin, FaTiktok, FaX, FaYoutube } from 'react-icons/fa6';
import { submitContactForm } from '@/app/services/contactForm';

const ContactPage = () => {
  const [activeLocation, setActiveLocation] = useState('JaEla');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    submitted: false,
    error: null,
    success: false
  });

  // Default data (fallback)
  const [contactData, setContactData] = useState({
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

  // Fetch settings from Firebase
  const { data, error, isLoading } = useFooterSettings();

  // Update state when settings are loaded
  useEffect(() => {
    if (data) {
      setContactData({
        phoneNumbers: data.phoneNumbers || contactData.phoneNumbers,
        addresses: data.addresses || contactData.addresses,
        email: data.email || contactData.email,
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear any previous errors when user starts typing
    if (formStatus.error) {
      setFormStatus(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set submitting state
    setFormStatus({
      isSubmitting: true,
      submitted: false,
      error: null,
      success: false
    });

    try {
      // Submit form to Firebase
      const result = await submitContactForm(formData);

      if (result.success) {
        // Success state
        setFormStatus({
          isSubmitting: false,
          submitted: true,
          error: null,
          success: true
        });

        // Reset form data
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, submitted: false, success: false }));
        }, 5000);

      } else {
        // Error state
        setFormStatus({
          isSubmitting: false,
          submitted: false,
          error: result.error,
          success: false
        });
      }

    } catch (error) {
      // Unexpected error
      setFormStatus({
        isSubmitting: false,
        submitted: false,
        error: 'An unexpected error occurred. Please try again.',
        success: false
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden"
        style={{
          backgroundImage: "url('/i4.jpg')"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-red-600/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              Contact <span className="text-red-500">Us</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Get in touch with <span className="text-red-500 font-semibold">ASD Camera</span> - Your trusted camera service provider in Sri Lanka
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-4xl font-bold text-black mb-2">
                  Get In <span className="text-red-500">Touch</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  We're here to help you with all your camera service needs
                </p>
              </motion.div>

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-300 w-16 h-16 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="bg-gray-300 h-4 w-24 rounded"></div>
                        <div className="bg-gray-300 h-4 w-32 rounded"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  variants={itemVariants}
                  className="bg-red-50 border border-red-200 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 p-2 rounded-full">
                      <MdEmail className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-red-700 font-semibold">Unable to load contact data</h3>
                      <p className="text-red-600 text-sm">Using default information</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Card */}
              {!isLoading && (
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500 p-4 rounded-full">
                      <MdEmail className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black">Email Us</h3>
                      <p className="text-red-500 text-lg font-medium">{contactData.email}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Location Tabs */}
              {!isLoading && (
                <motion.div variants={itemVariants}>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Object.keys(contactData.phoneNumbers).map((location) => (
                      <button
                        key={location}
                        onClick={() => setActiveLocation(location)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                          activeLocation === location
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white text-black border border-gray-200 hover:border-red-500'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>

                  {/* Active Location Details */}
                  <motion.div
                    key={activeLocation}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="space-y-4">
                      {/* Address */}
                      {contactData.addresses[activeLocation] && (
                        <div className="flex items-start gap-4">
                          <div className="bg-black p-3 rounded-full">
                            <FaMapMarkerAlt className="text-red-500 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-black">Address</h3>
                            <p className="text-gray-600">{contactData.addresses[activeLocation]}</p>
                          </div>
                        </div>
                      )}

                      {/* Phone Numbers */}
                      {contactData.phoneNumbers[activeLocation] && (
                        <div className="flex items-start gap-4">
                          <div className="bg-black p-3 rounded-full">
                            <FaPhone className="text-red-500 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-black">Phone Numbers</h3>
                            <div className="space-y-1">
                              {contactData.phoneNumbers[activeLocation].map((number, index) => (
                                <p key={index} className="text-gray-600">{number}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Loading state for location tabs */}
              {isLoading && (
                <motion.div variants={itemVariants}>
                  <div className="animate-pulse space-y-4">
                    <div className="flex gap-2">
                      <div className="bg-gray-300 h-12 w-20 rounded-full"></div>
                      <div className="bg-gray-300 h-12 w-24 rounded-full"></div>
                      <div className="bg-gray-300 h-12 w-20 rounded-full"></div>
                    </div>
                    <div className="bg-gray-200 rounded-2xl p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="bg-gray-300 h-4 w-16 rounded"></div>
                            <div className="bg-gray-300 h-4 w-48 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="bg-gray-300 h-4 w-24 rounded"></div>
                            <div className="bg-gray-300 h-4 w-32 rounded"></div>
                            <div className="bg-gray-300 h-4 w-32 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Media */}
              <motion.div
                variants={itemVariants}
                className="bg-black rounded-2xl p-6 text-white"
              >
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaFacebook className="text-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaInstagram className="text-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaGoogle className="text-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaX className="text-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaYoutube className="text-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaTiktok className="text-2xl" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-red-500 p-3 rounded-full cursor-pointer"
                  >
                    <FaLinkedin className="text-2xl" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-black mb-2">
                  Send us a <span className="text-red-500">Message</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible
                </p>
              </motion.div>

              {/* Success Message */}
              {formStatus.submitted && formStatus.success && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                      <h4 className="text-green-700 font-semibold">Message Sent Successfully!</h4>
                      <p className="text-green-600 text-sm">We'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {formStatus.error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <FaExclamationCircle className="text-red-500 text-xl" />
                    <div>
                      <h4 className="text-red-700 font-semibold">Error</h4>
                      <p className="text-red-600 text-sm">{formStatus.error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.form 
                onSubmit={handleSubmit}
                variants={containerVariants}
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="Your Name"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-black font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="your@email.com"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-black font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="What's this about?"
                    required
                    disabled={formStatus.isSubmitting}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-black font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                    placeholder="Tell us more about your needs..."
                    required
                    disabled={formStatus.isSubmitting}
                  ></textarea>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    whileHover={!formStatus.isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!formStatus.isSubmitting ? { scale: 0.98 } : {}}
                    disabled={formStatus.isSubmitting}
                    className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      formStatus.isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <MdSend className="text-xl" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        className="bg-black text-white py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to work with <span className="text-red-500">ASD Camera</span>?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Contact us today and experience the best camera service in Sri Lanka
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;