"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/lib/firestore/categories/read";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import { getProducts } from "@/lib/firestore/products/read_server";

const ResponsiveMenuBar = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  
  // Use ref to track timeout for proper cleanup
  const hoverTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
  const categoriesContainerRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories();

  // Load all products once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchAllProducts = async () => {
      try {
        const allProds = await getProducts();
        if (isMounted) {
          setAllProducts(allProds || []);
        }
      } catch (error) {
        if (isMounted) {
          setAllProducts([]);
        }
      }
    };

    fetchAllProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize category IDs from products for better performance
  const categoryIdsInProducts = useMemo(() => {
    const categoryIds = new Set();
    allProducts.forEach((product) => {
      if (product.categoryId) categoryIds.add(product.categoryId);
      if (product.categoryIds && Array.isArray(product.categoryIds)) {
        product.categoryIds.forEach((id) => categoryIds.add(id));
      }
    });
    return Array.from(categoryIds);
  }, [allProducts]);

  // Show all categories with smooth scrolling behavior
  const displayCategories = useMemo(() => {
    return categories;
  }, [categories]);

  // Calculate how many categories to show at once
  const categoriesPerView = 5;
  const maxVisibleIndex = Math.max(0, displayCategories.length - categoriesPerView);

  // Optimized product fetching with cleanup
  useEffect(() => {
    if (!hoveredCategory) {
      setProducts([]);
      return;
    }

    let isMounted = true;
    let timeoutId;

    const fetchProducts = async () => {
      if (!isMounted) return;

      setProductsLoading(true);

      try {
        let fetchedProducts = await getProductsByCategory({
          categoryId: hoveredCategory,
        });

        // Fallback to manual filtering if server function returns empty
        if (!fetchedProducts || fetchedProducts.length === 0) {
          fetchedProducts = allProducts.filter((product) => {
            return (
              product.categoryId === hoveredCategory ||
              (product.categoryIds &&
                Array.isArray(product.categoryIds) &&
                product.categoryIds.includes(hoveredCategory))
            );
          });
        }

        if (isMounted) {
          setProducts(fetchedProducts || []);
        }
      } catch (error) {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    timeoutId = setTimeout(fetchProducts, 100);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hoveredCategory, allProducts]);

  // Fixed hover handlers
  const handleMouseEnter = useCallback((categoryId, index) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    isHoveringRef.current = true;
    setHoveredCategory(categoryId);
    
    // Auto-adjust view to keep hovered category visible
    if (index < selectedCategoryIndex) {
      setSelectedCategoryIndex(Math.max(0, index));
    } else if (index >= selectedCategoryIndex + categoriesPerView) {
      setSelectedCategoryIndex(Math.min(maxVisibleIndex, index - categoriesPerView + 1));
    }
  }, [selectedCategoryIndex, maxVisibleIndex]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a new timeout
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setHoveredCategory(null);
      }
    }, 150);
  }, []);

  // Handle dropdown mouse enter (to keep it open when hovering over dropdown)
  const handleDropdownMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    isHoveringRef.current = true;
  }, []);

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setHoveredCategory(null);
      }
    }, 150);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Memoized animation variants
  const menuVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 },
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          staggerChildren: 0.05,
        },
      },
    }),
    []
  );

  const productVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.9, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.2 },
      },
    }),
    []
  );

  const mobileMenuVariants = useMemo(
    () => ({
      hidden: { x: "100%" },
      visible: {
        x: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      },
    }),
    []
  );

  // Memoized current category name
  const currentCategoryName = useMemo(() => {
    return (
      categories.find((cat) => cat.id === hoveredCategory)?.name || "Products"
    );
  }, [categories, hoveredCategory]);

  // Handle mobile category click
  const handleMobileCategoryClick = useCallback((categoryId) => {
    window.location.href = `/products?category=${categoryId}`;
    setMobileMenuOpen(false);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Swipe functionality for mobile
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedCategoryIndex < maxVisibleIndex) {
      setSelectedCategoryIndex(prev => Math.min(maxVisibleIndex, prev + 1));
    }
    if (isRightSwipe && selectedCategoryIndex > 0) {
      setSelectedCategoryIndex(prev => Math.max(0, prev - 1));
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [selectedCategoryIndex, maxVisibleIndex]);

  // Navigate categories with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && selectedCategoryIndex > 0) {
        setSelectedCategoryIndex(prev => Math.max(0, prev - 1));
      }
      if (e.key === 'ArrowRight' && selectedCategoryIndex < maxVisibleIndex) {
        setSelectedCategoryIndex(prev => Math.min(maxVisibleIndex, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategoryIndex, maxVisibleIndex]);

  // Handle category navigation buttons
  const navigateToCategory = useCallback((direction) => {
    if (direction === 'prev' && selectedCategoryIndex > 0) {
      setSelectedCategoryIndex(prev => Math.max(0, prev - 1));
    }
    if (direction === 'next' && selectedCategoryIndex < maxVisibleIndex) {
      setSelectedCategoryIndex(prev => Math.min(maxVisibleIndex, prev + 1));
    }
  }, [selectedCategoryIndex, maxVisibleIndex]);

  // Error boundary for image loading
  const handleImageError = useCallback((e) => {
    e.target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Q0E0QUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=";
  }, []);

  // Loading state
  if (categoriesLoading) {
    return (
      <div className="w-full h-16 bg-gradient-to-r from-red-600 via-red-500 to-red-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <div className="w-full h-16 bg-gradient-to-r from-red-600 via-red-500 to-red-600 flex items-center justify-center">
        <div className="text-white/90 text-sm font-medium">Error loading categories</div>
      </div>
    );
  }

  // No categories state
  if (!categories.length) {
    return (
      <div className="w-full h-16 bg-gradient-to-r from-red-600 via-red-500 to-red-600 flex items-center justify-center">
        <div className="text-white/70 text-sm">No categories available</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Menu Bar */}
      <nav className="bg-[#FF0000] text-white shadow-2xl relative z-50 border-b-4 border-red-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            {/* Desktop Menu - Centered with Navigation */}
            <div className="hidden md:flex items-center w-full max-w-6xl gap-6">
              {/* Left Navigation Arrow */}
              {selectedCategoryIndex > 0 && (
                <motion.button
                  onClick={() => navigateToCategory('prev')}
                  className="bg-white backdrop-blur-sm text-black rounded-full p-2 shadow-xl transition-all duration-200 flex-shrink-0 border border-white/20"
                  aria-label="Previous categories"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
              )}

              {/* Categories Container */}
              <div 
                ref={categoriesContainerRef}
                className="flex-1 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <motion.div 
                  className="flex items-center gap-3"
                  animate={{ 
                    x: selectedCategoryIndex * -200 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 40,
                    duration: 0.6
                  }}
                >
                  {displayCategories.map((category, index) => {
                    const isVisible = index >= selectedCategoryIndex && index < selectedCategoryIndex + categoriesPerView;
                    
                    return (
                      <motion.div
                        key={category.id}
                        className="relative flex-shrink-0"
                        onMouseEnter={() => handleMouseEnter(category.id, index)}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: isVisible ? 1 : 0.3,
                          y: 0,
                          scale: isVisible ? 1 : 0.9
                        }}
                        transition={{ 
                          duration: 0.3,
                          delay: isVisible ? (index - selectedCategoryIndex) * 0.1 : 0
                        }}
                      >
                        <motion.button
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap min-w-[180px] justify-center relative overflow-hidden backdrop-blur-sm ${
                            hoveredCategory === category.id
                              ? 'bg-white text-black shadow-xl transform scale-105 border border-white/50'
                              : 'hover:bg-black/80 hover:text-white border border-black/50 hover:border-black/80 bg-black/70 text-white'
                          }`}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          title={category.name}
                        >
                          {/* Background gradient effect */}
                          <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            animate={{ 
                              x: hoveredCategory === category.id ? '0%' : '-100%'
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <span className="relative z-10 truncate max-w-[150px] font-semibold">
                            {category.name}
                          </span>
                          <motion.div
                            className="relative z-10 ml-2"
                            animate={{ 
                              rotate: hoveredCategory === category.id ? 180 : 0 
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Right Navigation Arrow */}
              {selectedCategoryIndex < maxVisibleIndex && (
                <motion.button
                  onClick={() => navigateToCategory('next')}
                  className="bg-white backdrop-blur-sm text-black rounded-full p-2 shadow-xl transition-all duration-200 flex-shrink-0 border border-white/20"
                  aria-label="Next categories"
                  whileHover={{ scale: 1.1}}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className="bg-white/20 backdrop-blur-sm inline-flex items-center justify-center p-3 rounded-lg text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 shadow-xl border border-white/20"
                aria-label="Open mobile menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Desktop Dropdown Menu */}
        <AnimatePresence>
          {hoveredCategory && (
            <motion.div
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t-4 border-red-500 z-40"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent" />
                    <span className="ml-3 text-black font-medium">
                      Loading products...
                    </span>
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-sm text-black font-medium">
                        {products.length} product{products.length !== 1 ? 's' : ''} available
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                      {products.slice(0, 12).map((product, index) => (
                        <Link
                          key={product.id || `product-${index}`}
                          href={`/products/${product?.id}`}
                          className="block"
                        >
                          <motion.div
                            className="group cursor-pointer"
                            variants={productVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          >
                            <div className="relative overflow-hidden rounded-xl bg-white w-full h-40 mb-3 border-2 border-gray-100 shadow-lg group-hover:shadow-xl group-hover:border-gray-300 transition-all duration-300">
                              <img
                                src={
                                  product.imageList?.[0] ||
                                  product.image ||
                                  product.featureImageURL ||
                                  "/api/placeholder/300/300"
                                }
                                alt={product.name || "Product"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={handleImageError}
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                View
                              </div>
                            </div>

                            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors duration-200 text-center line-clamp-2 min-h-[2.5rem] leading-tight">
                              {product.name || product.title || "Unnamed Product"}
                            </h3>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                    
                    {products.length > 12 && (
                      <motion.div 
                        className="mt-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link href={`/products?category=${hoveredCategory}`}>
                          <motion.button
                            className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white px-8 py-3 rounded-full hover:from-red-700 hover:via-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl border border-red-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View All Products ({products.length})
                          </motion.button>
                        </Link>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-black text-6xl mb-4">📦</div>
                    <p className="text-black text-lg mb-2 font-semibold">
                      No products found in this category
                    </p>
                    <p className="text-gray-700 text-sm">
                      Check back later for new additions
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden border-l-4 border-red-500"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center justify-between p-6 border-b-2 border-red-100 bg-gradient-to-r from-red-600 via-red-500 to-red-600">
                <h2 className="text-xl font-bold text-white">
                  Categories
                </h2>
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Close mobile menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="py-4 overflow-y-auto max-h-full">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    className="w-full text-left px-6 py-4 text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-600 transition-all duration-200 border-b border-red-100 flex items-center justify-between group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.05 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMobileCategoryClick(category.id)}
                  >
                    <span className="font-semibold truncate group-hover:font-bold transition-all duration-200">
                      {category.name}
                    </span>
                    <motion.div
                      className="h-4 w-4 text-red-400 group-hover:text-red-600 flex-shrink-0"
                      whileHover={{ x: 5 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                ))}
                
                {categories.length === 0 && (
                  <div className="px-6 py-12 text-center text-red-500">
                    <div className="text-4xl mb-4">📂</div>
                    <p className="font-semibold">No categories available</p>
                    <p className="text-sm mt-1 text-red-400">Check back later</p>
                  </div>
                )}
                
                <div className="px-6 py-4 text-xs text-red-600 border-t-2 border-red-100 mt-4 bg-gradient-to-r from-red-50 to-orange-50">
                  <p className="text-center font-semibold">
                    Tap any category to view products
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay to prevent content interaction when dropdown is open */}
      {hoveredCategory && (
        <div className="fixed inset-0 z-30" style={{ top: "80px" }} />
      )}
    </div>
  );
};

export default ResponsiveMenuBar;