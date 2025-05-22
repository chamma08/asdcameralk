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
                ? `${data?.carts?.length} items • Rs. ${formatCurrency(cartTotal.toFixed(0))}.00`
                : "My Cart"
            }
            placement="bottom"
          >
            <div className="relative">
              {(data?.carts?.length ?? 0) > 0 ? (
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.button
                    aria-label="My Cart"
                    className="relative bg-red-500 hover:bg-red-600 text-white rounded-full p-2 flex items-center gap-2 min-w-max transition-colors duration-200"
                  >
                    <ShoppingCart size={16} className="flex-shrink-0" />
                    
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <span>{data?.carts?.length}</span>
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
                            key="price"
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