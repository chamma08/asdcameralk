"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
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
  
  // Use ref to track timeout for proper cleanup
  const hoverTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);

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

  // Limit categories to 10 for better display
  const displayCategories = useMemo(() => {
    return categories.slice(0, 10);
  }, [categories]);

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
  const handleMouseEnter = useCallback((categoryId) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    isHoveringRef.current = true;
    setHoveredCategory(categoryId);
  }, []);

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
    }, 150); // Reduced delay for better responsiveness
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
    // Navigate to products page with category filter or open category products
    window.location.href = `/products?category=${categoryId}`;
    setMobileMenuOpen(false);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Error boundary for image loading
  const handleImageError = useCallback((e) => {
    e.target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Q0E0QUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=";
  }, []);

  // Loading state
  if (categoriesLoading) {
    return (
      <div className="w-full h-16 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <div className="w-full h-16 bg-black flex items-center justify-center">
        <div className="text-red-500 text-sm">Error loading categories</div>
      </div>
    );
  }

  // No categories state
  if (!categories.length) {
    return (
      <div className="w-full h-16 bg-black flex items-center justify-center">
        <div className="text-gray-400 text-sm">No categories available</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Menu Bar */}
      <nav className="bg-black text-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            {/* Desktop Menu - Centered */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1">
                {displayCategories.map((category) => (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                        hoveredCategory === category.id
                          ? 'bg-red-600 text-white'
                          : 'hover:bg-red-600 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="bg-red-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
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
                    <span className="ml-2 text-gray-600">
                      Loading products...
                    </span>
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Found {products.length} products
                      </p>
                    </div>
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
                            whileHover={{ y: -5 }}
                          >
                            <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full h-40 mb-3 border border-gray-200">
                              <img
                                src={
                                  product.imageList?.[0] ||
                                  product.image ||
                                  product.featureImageURL ||
                                  "/api/placeholder/300/300"
                                }
                                alt={product.name || "Product"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                            </div>

                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200 text-center line-clamp-2 min-h-[2.5rem] leading-tight">
                              {product.name || product.title || "Unnamed Product"}
                            </h3>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                    {products.length > 12 && (
                      <div className="mt-8 text-center">
                        <Link href="/products">
                          <motion.button
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View All Products ({products.length})
                          </motion.button>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-2">
                      No products found in this category
                    </p>
                  </div>
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
              className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Categories
                </h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="py-4 overflow-y-auto">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    className="w-full text-left px-4 py-3 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 border-b border-gray-100 flex items-center justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.1 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMobileCategoryClick(category.id)}
                  >
                    <span className="font-medium">{category.name}</span>
                    <ChevronDown className="h-4 w-4 transform rotate-[-90deg] text-gray-400" />
                  </motion.button>
                ))}
                
                {categories.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <p>No categories available</p>
                  </div>
                )}
                
                <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-200 mt-4">
                  Tap any category to view products
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay to prevent content interaction when dropdown is open */}
      {hoveredCategory && (
        <div className="fixed inset-0 z-30" style={{ top: "64px" }} />
      )}
    </div>
  );
};

export default ResponsiveMenuBar;