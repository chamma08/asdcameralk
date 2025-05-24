"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { Search, Filter, X, ShoppingBag, Star, Heart, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

import { useProducts } from '@/lib/firestore/products/read';
import { useCategories } from '@/lib/firestore/categories/read';
import { useBrands } from '@/lib/firestore/brands/read';
import AuthContextProvider from '@/context/AuthContext';
import FavoriteButton from '@/app/components/FavoriteButton';
import AddToCartButton from '@/app/components/AddToCartButton';

const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 100, scale: 0.5 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: delay,
      duration: 0.5,
      ease: easeInOut,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.5,
    transition: {
      duration: 0.5,
      ease: easeInOut,
    },
  },
});

// Image Modal Component
function ImageModal({ isOpen, onClose, imageUrl, productTitle }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 z-10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={imageUrl}
            alt={productTitle}
            className="w-full h-full object-contain"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Fetch all products initially
  const { data: allProducts, isLoading: productsLoading, error: productsError } = useProducts({ pageLimit: 100 });
  
  // Fetch categories from database
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Fetch brands from database
  const { data: brands, isLoading: brandsLoading, error: brandsError } = useBrands();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 ||
                             (product.categoryIds && selectedCategories.some(cat => product.categoryIds.includes(cat)));
      
      const matchesBrand = selectedBrands.length === 0 ||
                          (product.brandIds && selectedBrands.some(brand => product.brandIds.includes(brand))) ||
                          selectedBrands.includes(product.brand);
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
      case 'price-high':
        return filtered.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return filtered.sort((a, b) => {
          const aTime = a.timestampCreate?.seconds || 0;
          const bTime = b.timestampCreate?.seconds || 0;
          return bTime - aTime;
        });
    }
  }, [allProducts, searchTerm, selectedCategories, selectedBrands, sortBy]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchTerm('');
  };

  const openMessenger = (product) => {
    const pageId = "YOUR_PAGE_ID";
    const message = encodeURIComponent(`I'm interested in renting: ${product?.title}`);
    const messengerUrl = `https://m.me/${pageId}?ref=${product?.id}&initialMessage=${message}`;
    window.open(messengerUrl, "_blank");
  };

  // Handle loading and error states
  const isLoading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-red-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading data</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white py-8"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">Our Products</h1>
          <p className="text-center text-gray-100">Quality equipment available for rent</p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Toggle and Sort */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                  <span className="bg-white text-red-500 text-xs px-2 py-1 rounded-full font-semibold">
                    {selectedCategories.length + selectedBrands.length}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-2 items-center"
              >
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategories.map(catId => {
                  const category = categories?.find(c => c.id === catId);
                  return (
                    <motion.span
                      key={catId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {category?.name || catId}
                      <button onClick={() => toggleCategory(catId)}>
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  );
                })}
                {selectedBrands.map(brandId => {
                  const brand = brands?.find(b => b.id === brandId);
                  return (
                    <motion.span
                      key={brandId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {brand?.name || brandId}
                      <button onClick={() => toggleBrand(brandId)}>
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="text-red-500 text-sm hover:text-red-700 underline ml-2"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="w-64 bg-white p-6 rounded-lg h-fit shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-800">Categories</h4>
                  <div className="space-y-2">
                    {categoriesLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center gap-2 p-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : categories && categories.length > 0 ? (
                      categories.map(category => (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="accent-red-500"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No categories available</p>
                    )}
                  </div>
                </div>

                {/* Brands - FIXED SECTION */}
                {brands && brands.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-gray-800">Brands</h4>
                    <div className="space-y-2">
                      {brandsLoading ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2 p-2">
                              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        brands.map(brand => (
                          <label
                            key={brand.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand.id)}
                              onChange={() => toggleBrand(brand.id)}
                              className="accent-red-500"
                            />
                            <span className="text-sm">{brand.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex items-center justify-between"
            >
              <p className="text-gray-600">
                {isLoading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      delay={index * 0.1}
                      isHovered={hoveredProduct === product.id}
                      onHover={() => setHoveredProduct(product.id)}
                      onLeave={() => setHoveredProduct(null)}
                      onMessenger={() => openMessenger(product)}
                      onToggleFavorite={() => toggleFavorite(product.id)}
                      isFavorite={favorites.has(product.id)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, delay, isHovered, onHover, onLeave, onMessenger, onToggleFavorite, isFavorite }) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const discountPercentage = product?.price && product?.salePrice && product?.price !== product?.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  if (!product?.id) {
    return null;
  }

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <>
      <motion.div 
        variants={fadeUp(delay)}
        initial="hidden"
        whileInView="show"
        exit="exit"
        whileHover={{ y: -5 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-[400px] flex flex-col"
      >
        <div className="relative flex-shrink-0 bg-white">
          {/* Image container with better aspect ratio handling */}
          <div className="relative w-full h-56 flex items-center justify-center overflow-hidden bg-white">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                <ShoppingBag className="w-12 h-12 mb-2" />
                <span className="text-sm">Image not available</span>
              </div>
            ) : (
              <img
                src={product.featureImageURL || '/placeholder-image.jpg'}
                alt={product.title}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}

            {/* Image overlay on hover */}
            <AnimatePresence>
              {isHovered && !imageError && !imageLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black cursor-pointer bg-opacity-5 flex items-center justify-center"
                >
                  {/* <motion.button
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={() => setImageModalOpen(true)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Image</span>
                  </motion.button> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                {discountPercentage}% OFF
              </span>
            )}
            
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                NEW
              </span>
            )}
          </div>
          
          {/* Favorite button */}
          <div className="absolute top-2 right-2">
            <AuthContextProvider>
              <FavoriteButton productId={product.id} />
            </AuthContextProvider>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors text-sm md:text-base">
              {product.title}
            </h3>
          </Link>
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-red-600">
                LKR {(product.salePrice || product.price || 0).toLocaleString()}
              </span>
              {product.salePrice !== product.price && product.price && (
                <span className="line-through text-sm text-gray-500">
                  LKR {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onMessenger}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Rent Now
              </motion.button>
              <AuthContextProvider>
                <AddToCartButton productId={product.id} />
              </AuthContextProvider>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {/* <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={product.featureImageURL}
        productTitle={product.title}
      /> */}
    </>
  );
}