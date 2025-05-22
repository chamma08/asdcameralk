"use client";

import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Local storage helper functions
const getLocalCart = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

const setLocalCart = (cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export default function Page() {
  const { user } = useAuth();
  const { data: userData, isLoading } = useUser({ uid: user?.uid });
  const [localCart, setLocalCartState] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Load local cart on mount
  useEffect(() => {
    if (!user) {
      const cart = getLocalCart();
      setLocalCartState(cart);
    }
    setIsLoadingLocal(false);
  }, [user]);

  // Get cart data based on user authentication status
  const cartData = user ? userData?.carts : localCart;
  const isCartLoading = user ? isLoading : isLoadingLocal;

  if (isCartLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-3 justify-center items-center p-5">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {(!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-blue-800 text-sm">
            <Link href="/login" className="underline font-semibold">Login</Link> to sync your cart across devices
          </p>
        </div>
      ))}
      {(!cartData || cartData?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty.gif" alt="" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Cart
          </h1>
        </div>
      )}
      <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2">
        {cartData?.map((item, key) => {
          return (
            <ProductItem 
              item={item} 
              key={item?.id} 
              isLoggedIn={!!user}
              onLocalCartUpdate={setLocalCartState}
            />
          );
        })}
      </div>
      <div>
        <Link href={`/checkout?type=cart`}>
          <button className="bg-blue-500 px-5 py-2 text-sm rounded-lg text-white">
            Checkout
          </button>
        </Link>
      </div>
    </main>
  );
}

function ProductItem({ item, isLoggedIn, onLocalCartUpdate }) {
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: product } = useProduct({ productId: item?.id });

  const handleRemove = async () => {
    if (!confirm("Are you sure?")) return;
    setIsRemoving(true);
    
    try {
      if (isLoggedIn) {
        // Handle logged-in user cart
        const newList = userData?.carts?.filter((d) => d?.id != item?.id);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        // Handle local cart
        const currentCart = getLocalCart();
        const newCart = currentCart.filter((d) => d?.id !== item?.id);
        setLocalCart(newCart);
        onLocalCartUpdate(newCart);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      // Note: toast is not imported, you may want to add toast notification here
    }
    
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity) => {
    if (quantity <= 0) return;
    
    setIsUpdating(true);
    
    try {
      if (isLoggedIn) {
        // Handle logged-in user cart
        const newList = userData?.carts?.map((d) => {
          if (d?.id === item?.id) {
            return {
              ...d,
              quantity: parseInt(quantity),
            };
          } else {
            return d;
          }
        });
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        // Handle local cart
        const currentCart = getLocalCart();
        const newCart = currentCart.map((d) => {
          if (d?.id === item?.id) {
            return {
              ...d,
              quantity: parseInt(quantity),
            };
          } else {
            return d;
          }
        });
        setLocalCart(newCart);
        onLocalCartUpdate(newCart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Note: toast is not imported, you may want to add toast notification here
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-3 items-center border px-3 py-3 rounded-xl">
      <div className="h-14 w-14 p-1">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={product?.featureImageURL}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-sm font-semibold">{product?.title}</h1>
        <div className="text-green-500 text-sm">
          {product?.salePrice === product?.price ? (
            <span>LKR {product?.salePrice}</span>
          ) : (
            <>
              LKR {product?.salePrice}{" "}
              <span className="line-through text-xs text-gray-500">
                LKR {product?.price}
              </span>
            </>
          )}
        </div>
        <div className="flex text-xs items-center gap-2">
          <Button
            onClick={() => {
              handleUpdate(item?.quantity - 1);
            }}
            isDisabled={isUpdating || item?.quantity <= 1}
            isIconOnly
            size="sm"
            className="h-6 w-4"
          >
            <Minus size={12} />
          </Button>
          <h2>{item?.quantity}</h2>
          <Button
            onClick={() => {
              handleUpdate(item?.quantity + 1);
            }}
            isDisabled={isUpdating}
            isIconOnly
            size="sm"
            className="h-6 w-4"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          onClick={handleRemove}
          isLoading={isRemoving}
          isDisabled={isRemoving}
          isIconOnly
          color="danger"
          size="sm"
        >
          <X size={13} />
        </Button>
      </div>
    </div>
  );
}