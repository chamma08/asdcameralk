"use client";

import { useUser } from "@/lib/firestore/user/read";
import { updateFavorites } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function FavoriteButton({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Logged In First!");
      }
      if (data?.favorites?.includes(productId)) {
        const newList = data?.favorites?.filter((item) => item != productId);
        await updateFavorites({ list: newList, uid: user?.uid });
        toast.success("Removed from favorites");
      } else {
        await updateFavorites({
          list: [...(data?.favorites ?? []), productId],
          uid: user?.uid,
        });
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const isLiked = data?.favorites?.includes(productId);

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handlClick}
      variant="light"
      color="danger"
      className="rounded-full"
      isIconOnly
      size="sm"
    >
      {!isLiked && <FavoriteBorderIcon fontSize="small" />}
      {isLiked && <FavoriteIcon fontSize="small" />}
    </Button>
  );
}