"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Badge, Tooltip, Spinner } from "@nextui-org/react";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct } from "@/lib/firestore/products/read_server";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderClientButtons() {
    const { user } = useAuth();
    const { data } = useUser({ uid: user?.uid });
    const [cartTotal, setCartTotal] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    
    // Format number with commas for thousands
    const formatCurrency = (number) => {
      return new Intl.NumberFormat('si-LK').format(number);
    };
    
    // Calculate cart total whenever cart items change
    useEffect(() => {
      const calculateCartTotal = async () => {
        if (!data?.carts || data.carts.length === 0) {
          setCartTotal(0);
          return;
        }
        
        setIsCalculating(true);
        let total = 0;
        
        try {
          const productPromises = data.carts.map(item => 
            getProduct({ id: item.id })
              .then(product => {
                if (product) {
                  // Use sale price if available, otherwise use regular price
                  const price = product.salePrice || product.price || 0;
                  return price * (item.quantity || 1);
                }
                return 0;
              })
              .catch(error => {
                console.error(`Error fetching product ${item.id}:`, error);
                return 0;
              })
          );
          
          // Process all products in parallel for better performance
          const productTotals = await Promise.all(productPromises);
          total = productTotals.reduce((sum, itemTotal) => sum + itemTotal, 0);
        } catch (error) {
          console.error("Error calculating cart total:", error);
        } finally {
          setCartTotal(total);
          setIsCalculating(false);
        }
      };
      
      calculateCartTotal();
    }, [data?.carts]);

    return (
      <div className="flex items-center gap-3">
        <Link href={`/favorites`}>
          <Tooltip content="My Favorites" placement="bottom">
            {(data?.favorites?.length ?? 0) > 0 ? (
              <Badge
                variant="solid"
                size="sm"
                className="text-white bg-red-500 text-[8px]"
                content={data?.favorites?.length ?? 0}
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
              (data?.carts?.length ?? 0) > 0 && cartTotal > 0 && !isCalculating
                ? `රු. ${formatCurrency(cartTotal.toFixed(0))}.00`
                : "My Cart"
            }
            placement="bottom"
          >
            <div className="relative">
              {(data?.carts?.length ?? 0) > 0 ? (
                <>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant="solid"
                      size="sm"
                      className="text-white bg-red-500 text-[8px]"
                      content={data?.carts?.length ?? 0}
                    >
                      <motion.button
                        aria-label="My Cart"
                        className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
                      >
                        <ShoppingCart size={14} />
                      </motion.button>
                    </Badge>
                    
                    {/* Cart Price Indicator */}
                    <AnimatePresence>
                      {!isCalculating && cartTotal > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-0 right-0 transform translate-x-3 -translate-y-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        >
                          රු{formatCurrency(cartTotal.toFixed(0))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Loading Indicator */}
                    <AnimatePresence>
                      {isCalculating && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-0 right-0 transform translate-x-3 -translate-y-1"
                        >
                          <div className="bg-green-500 rounded-full p-1">
                            <Spinner size="sm" classNames={{ circle: "text-white", track: "text-green-400" }} className="h-3 w-3" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
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