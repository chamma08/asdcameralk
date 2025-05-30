"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft, // Import ChevronsLeft
  ChevronsRight, // Import ChevronsRight
} from "lucide-react";
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

  const displayCategories = useMemo(() => {
    return categories;
  }, [categories]);

  const categoriesPerView = 5;
  const maxVisibleIndex = Math.max(
    0,
    displayCategories.length - categoriesPerView
  );

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

  const handleMouseEnter = useCallback(
    (categoryId, index) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      isHoveringRef.current = true;
      setHoveredCategory(categoryId);
      if (index < selectedCategoryIndex) {
        setSelectedCategoryIndex(Math.max(0, index));
      } else if (index >= selectedCategoryIndex + categoriesPerView) {
        setSelectedCategoryIndex(
          Math.min(maxVisibleIndex, index - categoriesPerView + 1)
        );
      }
    },
    [selectedCategoryIndex, maxVisibleIndex, categoriesPerView]
  );

  const handleMouseLeave = useCallback(() => {
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

  const handleDropdownMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    isHoveringRef.current = true;
  }, []);

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

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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

  const currentCategoryName = useMemo(() => {
    return (
      categories.find((cat) => cat.id === hoveredCategory)?.name || "Products"
    );
  }, [categories, hoveredCategory]);

  const handleMobileCategoryClick = useCallback((categoryId) => {
    window.location.href = `/products?category=${categoryId}`;
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

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
      setSelectedCategoryIndex((prev) => Math.min(maxVisibleIndex, prev + 1));
    }
    if (isRightSwipe && selectedCategoryIndex > 0) {
      setSelectedCategoryIndex((prev) => Math.max(0, prev - 1));
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [selectedCategoryIndex, maxVisibleIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && selectedCategoryIndex > 0) {
        setSelectedCategoryIndex((prev) => Math.max(0, prev - 1));
      }
      if (e.key === "ArrowRight" && selectedCategoryIndex < maxVisibleIndex) {
        setSelectedCategoryIndex((prev) => Math.min(maxVisibleIndex, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCategoryIndex, maxVisibleIndex]);

  const navigateToCategory = useCallback(
    (direction) => {
      if (direction === "prev" && selectedCategoryIndex > 0) {
        setSelectedCategoryIndex((prev) => Math.max(0, prev - 1));
      }
      if (direction === "next" && selectedCategoryIndex < maxVisibleIndex) {
        setSelectedCategoryIndex((prev) => Math.min(maxVisibleIndex, prev + 1));
      }
    },
    [selectedCategoryIndex, maxVisibleIndex]
  );

  const navigateToStart = useCallback(() => {
    setSelectedCategoryIndex(0);
  }, []);

  const navigateToEnd = useCallback(() => {
    setSelectedCategoryIndex(maxVisibleIndex);
  }, [maxVisibleIndex]);

  const handleImageError = useCallback((e) => {
    e.target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Q0E0QUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=";
  }, []);

  

  const navBarHeightStyle = 'var(--default-navbar-height, 47px)';
 
  const backdropTopStyle = `calc(${navBarHeightStyle} + 64px)`;


  if (categoriesLoading) {
    return (
      <div 
        className="sticky w-full h-12 bg-gradient-to-r from-red-600 via-red-500 to-red-600 flex items-center justify-center z-35"
        style={{ top: navBarHeightStyle }}
      >
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div 
        className="sticky w-full h-12 bg-gradient-to-r from-red-600 via-red-500 to-red-600 flex items-center justify-center z-35"
        style={{ top: navBarHeightStyle }}
      >
        <div className="text-white/90 text-xs font-medium">
          Error loading categories
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div 
        className="sticky w-full h-12 bg-gradient-to-r from-red-600 via-red-500 to-red-600 flex items-center justify-center z-35"
        style={{ top: navBarHeightStyle }}
      >
        <div className="text-white/70 text-xs">No categories available</div>
      </div>
    );
  }

  return (
    <div 
      className="sticky z-40"
      style={{ top: navBarHeightStyle }} 
    >
      <nav className="bg-[#FF0000] text-white shadow-2xl relative z-40 border-b-2 border-red-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="hidden md:flex items-center w-full max-w-6xl gap-4">
              {selectedCategoryIndex > 0 && (
                <motion.button
                  onClick={navigateToStart}
                  className="bg-white backdrop-blur-sm text-black rounded-full p-1.5 shadow-xl transition-all duration-200 flex-shrink-0 border border-white/20"
                  aria-label="Go to first categories"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </motion.button>
              )}

              {selectedCategoryIndex > 0 && (
                <motion.button
                  onClick={() => navigateToCategory("prev")}
                  className="bg-white backdrop-blur-sm text-black rounded-full p-1.5 shadow-xl transition-all duration-200 flex-shrink-0 border border-white/20"
                  aria-label="Previous categories"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
              )}

              <div
                ref={categoriesContainerRef}
                className="flex-1 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <motion.div
                  className="flex items-center gap-2"
                  animate={{
                    x: selectedCategoryIndex * -180,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                    duration: 0.6,
                  }}
                >
                  {displayCategories.map((category, index) => {
                    const isVisible =
                      index >= selectedCategoryIndex &&
                      index < selectedCategoryIndex + categoriesPerView;
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
                          scale: isVisible ? 1 : 0.9,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: isVisible
                            ? (index - selectedCategoryIndex) * 0.1
                            : 0,
                        }}
                      >
                        <motion.button
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap min-w-[160px] justify-center relative overflow-hidden backdrop-blur-sm ${
                            hoveredCategory === category.id
                              ? "bg-white text-black shadow-xl transform scale-105 border border-white/50"
                              : "hover:bg-black/80 hover:text-white border border-black/50 hover:border-black/80 bg-black text-white"
                          }`}
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 },
                          }}
                          whileTap={{ scale: 0.95 }}
                          title={category.name}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: "-100%" }}
                            animate={{
                              x:
                                hoveredCategory === category.id
                                  ? "0%"
                                  : "-100%",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10 truncate max-w-[130px] font-semibold text-sm">
                            {category.name}
                          </span>
                          <motion.div
                            className="relative z-10 ml-1.5"
                            animate={{
                              rotate: hoveredCategory === category.id ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {selectedCategoryIndex < maxVisibleIndex && (
                <motion.button
                  onClick={() => navigateToCategory("next")}
                  className="bg-white backdrop-blur-sm text-black rounded-full p-1.5 shadow-xl transition-all duration-200 flex-shrink-0 border border-white/20"
                  aria-label="Next categories"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              )}

              {selectedCategoryIndex < maxVisibleIndex && (
                <motion.button
                  onClick={navigateToEnd}
                  className="bg-white backdrop-blur-sm text-black rounded-full p-1.5 shadow-xl transition-all duration-200 flex-shrink-0 border border-white/20"
                  aria-label="Go to last categories"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronsRight className="h-4 w-4" />
                </motion.button>
              )}
            </div>

            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className="bg-white/20 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 shadow-xl border border-white/20"
                aria-label="Open mobile menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {hoveredCategory && (
            <motion.div
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t-2 border-red-500 z-40"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent" />
                    <span className="ml-2 text-black text-sm font-medium">
                      Loading products...
                    </span>
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-xs text-black font-medium">
                        {products.length} product
                        {products.length !== 1 ? "s" : ""} available
                      </p>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                          >
                            <div className="relative overflow-hidden bg-white w-full h-40 mb-2 border p-1 bg-center bg-cover border-gray-100 shadow-md group-hover:shadow-lg group-hover:border-gray-200 transition-all duration-300">
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
                              <div className="absolute top-1.5 right-1.5 bg-black text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                                View
                              </div>
                            </div>
                            <h3 className="text-xs font-semibold text-gray-800 group-hover:text-black transition-colors duration-200 text-center line-clamp-2 min-h-[2rem] leading-tight">
                              {product.name ||
                                product.title ||
                                "Unnamed Product"}
                            </h3>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                    {products.length > 12 && (
                      <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link href={`/products?category=${hoveredCategory}`}>
                          <motion.button
                            className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white px-6 py-2.5 rounded-full hover:from-red-700 hover:via-red-600 hover:to-red-700 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl border border-red-400"
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
                    className="text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-black text-5xl mb-3">📦</div>
                    <p className="text-black text-base mb-1 font-semibold">
                      No products found in this category
                    </p>
                    <p className="text-gray-700 text-xs">
                      Check back later for new additions
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden border-l-2 border-red-500"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-red-100 bg-gradient-to-r from-red-600 via-red-500 to-red-600">
                <h2 className="text-lg font-bold text-white">Categories</h2>
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Close mobile menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="py-3 overflow-y-auto max-h-full">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    className="w-full text-left px-5 py-3 text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-600 transition-all duration-200 border-b border-red-100 flex items-center justify-between group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.05 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMobileCategoryClick(category.id)}
                  >
                    <span className="font-semibold text-sm truncate group-hover:font-bold transition-all duration-200">
                      {category.name}
                    </span>
                    <motion.div
                      className="h-3.5 w-3.5 text-red-400 group-hover:text-red-600 flex-shrink-0"
                      whileHover={{ x: 5 }}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </motion.button>
                ))}
                {categories.length === 0 && (
                  <div className="px-5 py-10 text-center text-red-500">
                    <div className="text-3xl mb-3">📂</div>
                    <p className="font-semibold text-sm">
                      No categories available
                    </p>
                    <p className="text-xs mt-1 text-red-400">
                      Check back later
                    </p>
                  </div>
                )}
                <div className="px-5 py-3 text-xs text-red-600 border-t border-red-100 mt-3 bg-gradient-to-r from-red-50 to-orange-50">
                  <p className="text-center font-semibold">
                    Tap any category to view products
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {hoveredCategory && (
        <div 
          className="fixed inset-0 z-30" 
          style={{ top: backdropTopStyle }} 
        />
      )}
    </div>
  );
};

export default ResponsiveMenuBar;