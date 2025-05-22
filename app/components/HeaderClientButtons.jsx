"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Badge, Tooltip, Spinner } from "@nextui-org/react";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getProduct } from "@/lib/firestore/products/read_server";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderClientButtons() {
    const { user } = useAuth();
    const { data } = useUser({ uid: user?.uid });
    const [cartTotal, setCartTotal] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [localCart, setLocalCart] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(0);
    
    // Helper function to get guest cart from localStorage
    const getGuestCart = useCallback(() => {
      try {
        const savedCart = localStorage.getItem("guestCart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          return Array.isArray(parsedCart) ? parsedCart : [];
        }
      } catch (error) {
        console.error("Error parsing guest cart:", error);
        localStorage.removeItem("guestCart");
      }
      return [];
    }, []);
    
    // Load guest cart and set up listeners
    useEffect(() => {
      if (!user?.uid) {
        // Load initial cart
        const guestCart = getGuestCart();
        setLocalCart(guestCart);

        // Listen for storage changes (cross-tab updates)
        const handleStorageChange = (e) => {
          if (e.key === "guestCart") {
            const updatedCart = getGuestCart();
            setLocalCart(updatedCart);
            setForceUpdate(prev => prev + 1);
          }
        };

        // Listen for custom events (same-tab updates)
        const handleCartUpdate = (e) => {
          const updatedCart = e.detail?.cart || getGuestCart();
          setLocalCart(updatedCart);
          setForceUpdate(prev => prev + 1);
        };

        // Add event listeners
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("guestCartUpdated", handleCartUpdate);

        return () => {
          window.removeEventListener("storage", handleStorageChange);
          window.removeEventListener("guestCartUpdated", handleCartUpdate);
        };
      } else {
        // Clear local cart when user is logged in
        setLocalCart([]);
      }
    }, [user?.uid, getGuestCart]);
    
    // Get current cart items (user cart or guest cart)
    const currentCart = user?.uid ? (Array.isArray(data?.carts) ? data.carts : []) : localCart;
    
    // Format number with commas for thousands
    const formatCurrency = (number) => {
      return new Intl.NumberFormat('si-LK').format(number);
    };
    
    // Memoized cart total calculation function
    const calculateCartTotal = useCallback(async (cartItems) => {
      if (!cartItems || cartItems.length === 0) {
        setCartTotal(0);
        setIsCalculating(false);
        return;
      }
      
      setIsCalculating(true);
      let total = 0;
      
      try {
        // Create a map to avoid duplicate API calls for same product
        const uniqueProductIds = [...new Set(cartItems.map(item => item.id))];
        const productCache = new Map();
        
        // Fetch all unique products first
        const productPromises = uniqueProductIds.map(async (productId) => {
          try {
            const product = await getProduct({ id: productId });
            productCache.set(productId, product);
            return product;
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            productCache.set(productId, null);
            return null;
          }
        });
        
        await Promise.all(productPromises);
        
        // Calculate total using cached products
        total = cartItems.reduce((sum, item) => {
          const product = productCache.get(item.id);
          if (product) {
            const price = product.salePrice || product.price || 0;
            return sum + (price * (item.quantity || 1));
          }
          return sum;
        }, 0);
        
      } catch (error) {
        console.error("Error calculating cart total:", error);
      } finally {
        setCartTotal(total);
        setIsCalculating(false);
      }
    }, []);
    
    // Calculate cart total whenever cart items change
    useEffect(() => {
      calculateCartTotal(currentCart);
    }, [currentCart, calculateCartTotal, forceUpdate]);

    // Get cart count
    const cartCount = currentCart?.length || 0;
    const favoritesCount = (data?.favorites?.length ?? 0);

    return (
      <div className="flex items-center gap-3">
        <Link href={`/favorites`}>
          <Tooltip content="My Favorites" placement="bottom">
            {favoritesCount > 0 ? (
              <Badge
                variant="solid"
                size="sm"
                className="text-white bg-red-500 text-[8px]"
                content={favoritesCount}
              >
                <motion.button
                  aria-label="My Favorites"
                  className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={14} />
                </motion.button>
              </Badge>
            ) : (
              <motion.button
                aria-label="My Favorites"
                className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={14} />
              </motion.button>
            )}
          </Tooltip>
        </Link>
        
        <Link href={`/cart`}>
          <Tooltip 
            content={
              cartCount > 0 && cartTotal > 0 && !isCalculating
                ? `${cartCount} items • Rs. ${formatCurrency(cartTotal.toFixed(0))}.00`
                : "My Cart"
            }
            placement="bottom"
          >
            <div className="relative">
              {cartCount > 0 ? (
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={`cart-${cartCount}-${cartTotal}`} // Force re-render when cart changes
                >
                  <motion.button
                    aria-label="My Cart"
                    className="relative bg-red-500 hover:bg-red-600 text-white rounded-full p-2 flex items-center gap-2 min-w-max transition-colors duration-200"
                  >
                    <ShoppingCart size={16} className="flex-shrink-0" />
                    
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <span>{cartCount}</span>
                      <span className="text-red-200">•</span>
                      <AnimatePresence mode="wait">
                        {isCalculating ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center"
                          >
                            <Spinner size="sm" classNames={{ 
                              circle: "text-white", 
                              track: "text-red-400" 
                            }} className="h-3 w-3" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key={`price-${cartTotal}`}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap"
                          >
                            Rs.{formatCurrency(cartTotal.toFixed(0))}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  aria-label="My Cart"
                  className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={14} />
                </motion.button>
              )}
            </div>
          </Tooltip>
        </Link>
      </div>
    );
}