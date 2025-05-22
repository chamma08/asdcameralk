"use client";

import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";

export default function AddToCartButton({ productId, type }) {
  const authContext = useAuth();
  const user = authContext?.user || null;
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const [cartSynced, setCartSynced] = useState(false);

  // Helper function to get guest cart from localStorage
  const getGuestCart = () => {
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
  };

  // Helper function to save guest cart to localStorage
  const saveGuestCart = (cart) => {
    try {
      localStorage.setItem("guestCart", JSON.stringify(cart));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("guestCartUpdated", { 
        detail: { cart } 
      }));
    } catch (error) {
      console.error("Error saving guest cart:", error);
      toast.error("Failed to save cart");
    }
  };

  // Load cart from localStorage on component mount and when user changes
  useEffect(() => {
    if (!user?.uid) {
      const guestCart = getGuestCart();
      setLocalCart(guestCart);
    } else {
      setLocalCart([]);
    }
  }, [user?.uid]);

  // Listen for guest cart updates from other components
  useEffect(() => {
    if (!user?.uid) {
      const handleCartUpdate = () => {
        const updatedCart = getGuestCart();
        setLocalCart(updatedCart);
      };

      window.addEventListener("guestCartUpdated", handleCartUpdate);
      window.addEventListener("storage", handleCartUpdate);

      return () => {
        window.removeEventListener("guestCartUpdated", handleCartUpdate);
        window.removeEventListener("storage", handleCartUpdate);
      };
    }
  }, [user?.uid]);

  // Sync local cart to user account when they log in
  useEffect(() => {
    if (user?.uid && localCart.length > 0 && data?.carts !== undefined && !cartSynced) {
      const syncCart = async () => {
        try {
          const existingCart = Array.isArray(data?.carts) ? data.carts : [];
          const mergedCart = [...existingCart];
          
          // Add items from local cart that aren't already in user's cart
          localCart.forEach(localItem => {
            const existsInUserCart = existingCart.find(item => item.id === localItem.id);
            if (!existsInUserCart) {
              mergedCart.push(localItem);
            }
          });
          
          if (mergedCart.length > existingCart.length) {
            await updateCarts({ list: mergedCart, uid: user?.uid });
            localStorage.removeItem("guestCart");
            setLocalCart([]);
            setCartSynced(true);
            toast.success("Cart synced to your account");
          }
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      };
      
      syncCart();
    }
  }, [user?.uid, data?.carts, localCart, cartSynced]);

  // Determine if item is already in cart
  const isAdded = user?.uid 
    ? Array.isArray(data?.carts) && data.carts.find((item) => item?.id === productId)
    : localCart.find((item) => item?.id === productId);

  const handleClick = async () => {
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      if (user?.uid) {
        // User is logged in - use Firestore
        const currentCarts = Array.isArray(data?.carts) ? data.carts : [];
        
        if (isAdded) {
          const newList = currentCarts.filter((item) => item?.id !== productId);
          await updateCarts({ list: newList, uid: user?.uid });
          toast.success("Removed from cart");
        } else {
          const newList = [...currentCarts, { id: productId, quantity: 1 }];
          await updateCarts({
            list: newList,
            uid: user?.uid,
          });
          toast.success("Added to cart");
        }
      } else {
        // Guest user - use localStorage
        const currentCart = getGuestCart(); // Get fresh cart data
        
        if (isAdded) {
          const newCart = currentCart.filter((item) => item?.id !== productId);
          setLocalCart(newCart);
          saveGuestCart(newCart);
          toast.success("Removed from cart");
        } else {
          const newCart = [...currentCart, { id: productId, quantity: 1 }];
          setLocalCart(newCart);
          saveGuestCart(newCart);
          toast.success("Added to cart");
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  if (type === "cute") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handleClick}
        variant="bordered"
        className="border-red-500 text-red-500"
      >
        {!isAdded && "Add To Cart"}
        {isAdded && "Click To Remove"}
      </Button>
    );
  }

  if (type === "large") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handleClick}
        variant="bordered"
        className="border-red-500 text-red-500"
        color="primary"
        size="sm"
      >
        {!isAdded && <AddShoppingCartIcon className="text-xs" />}
        {isAdded && <ShoppingCartIcon className="text-xs" />}
        {!isAdded && "Add To Cart"}
        {isAdded && "Click To Remove"}
      </Button>
    );
  }

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleClick}
      variant="flat"
      isIconOnly
      size="sm"
    >
      {!isAdded && <AddShoppingCartIcon className="text-xs" />}
      {isAdded && <ShoppingCartIcon className="text-xs" />}
    </Button>
  );
}