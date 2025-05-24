"use client";

import React, { useState } from 'react';
import { Search, Grid, List, Eye } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useLogos } from '@/lib/firestore/client-logos/read';

export default function Page() {
  const { data: logos, error, isLoading } = useLogos();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedLogo, setSelectedLogo] = useState(null);

  // Typing animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
      },
    },
  };

  // Text to animate
  const text = "Our Valued Partners";
  const words = text.split(" ");

  // Logo animation variants
  const logoVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Logo Card Component with scroll animation
  const LogoCard = ({ logo, onClick, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
      <motion.div
        ref={ref}
        variants={logoVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: index * 0.1 }}
        key={logo.id}
        className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-red-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => onClick(logo)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          <img
            src={logo.imageURL}
            alt={logo.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-bold text-black text-center group-hover:text-red-600 transition-colors">
          {logo.name}
        </h3>
      </motion.div>
    );
  };

  // Logo List Item Component with scroll animation
  const LogoListItem = ({ logo, onClick, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
      <motion.div
        ref={ref}
        variants={logoVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: index * 0.05 }}
        key={logo.id}
        className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-red-600 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-6"
        onClick={() => onClick(logo)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center group-hover:bg-gray-100 transition-colors flex-shrink-0">
          <img
            src={logo.imageURL}
            alt={logo.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-black text-xl group-hover:text-red-600 transition-colors">
            {logo.name}
          </h3>
          {logo.timestampCreate && (
            <p className="text-gray-500 text-sm mt-1">
              Added {new Date(logo.timestampCreate.toDate()).toLocaleDateString()}
            </p>
          )}
        </div>
        <Eye className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
      </motion.div>
    );
  };

  // Filter logos based on search term
  const filteredLogos = logos?.filter(logo =>
    logo.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black text-lg">Loading our amazing clients</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    variants={letterVariants}
                    className={word === "Valued" ? "text-red-600" : ""}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            We're proud to work with industry-leading brands who trust us with their vision and success.
          </motion.p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-gray-50 border-b border-gray-200 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-white border-2 border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {filteredLogos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">
              {searchTerm ? 'No Clients found' : 'No Clients yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No Client match "${searchTerm}". Try a different search term.`
                : 'Clients will appear here once they are added.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-black">{filteredLogos.length}</span> Client{filteredLogos.length !== 1 ? 's' : ''}
                {searchTerm && <span> for "<span className="font-semibold text-red-600">{searchTerm}</span>"</span>}
              </p>
            </div>

            {/* Logos Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredLogos.map((logo, index) => (
                  <LogoCard 
                    key={logo.id}
                    logo={logo}
                    onClick={setSelectedLogo}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogos.map((logo, index) => (
                  <LogoListItem
                    key={logo.id}
                    logo={logo}
                    onClick={setSelectedLogo}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Logo Preview */}
      {selectedLogo && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">{selectedLogo.name}</h2>
              <button
                onClick={() => setSelectedLogo(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-6">
                <img
                  src={selectedLogo.imageURL}
                  alt={selectedLogo.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {selectedLogo.timestampCreate && (
                  <p>
                    <span className="font-semibold text-black">Added:</span>{' '}
                    {new Date(selectedLogo.timestampCreate.toDate()).toLocaleDateString()}
                  </p>
                )}
                {selectedLogo.timestampUpdate && (
                  <p>
                    <span className="font-semibold text-black">Updated:</span>{' '}
                    {new Date(selectedLogo.timestampUpdate.toDate()).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}