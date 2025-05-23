"use client";

import { useCategories } from '@/lib/firestore/categories/read';
import { deleteCategory, updateCategoryOrder } from '@/lib/firestore/categories/write';
import { Button, CircularProgress } from '@nextui-org/react';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function ListView() {
  const { data: categories, error, isLoading } = useCategories();
  
  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const currentItem = categories[index];
    const previousItem = categories[index - 1];
    
    try {
      // Swap order values
      await updateCategoryOrder({ id: currentItem.id, order: previousItem.order });
      await updateCategoryOrder({ id: previousItem.id, order: currentItem.order });
      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleMoveDown = async (index) => {
    if (index === categories.length - 1) return;
    
    const currentItem = categories[index];
    const nextItem = categories[index + 1];
    
    try {
      // Swap order values
      await updateCategoryOrder({ id: currentItem.id, order: nextItem.order });
      await updateCategoryOrder({ id: nextItem.id, order: currentItem.order });
      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <h1 className="text-xl">Categories</h1>
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">
              Order
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((item, index) => {
            return (
              <Row 
                index={index} 
                item={item} 
                key={item?.id}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === categories.length - 1}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

function Row({ item, index, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteCategory({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/categories?id=${item?.id}`);
  };

  const handleMoveUp = async () => {
    setIsUpdatingOrder(true);
    await onMoveUp();
    setIsUpdatingOrder(false);
  };

  const handleMoveDown = async () => {
    setIsUpdatingOrder(true);
    await onMoveDown();
    setIsUpdatingOrder(false);
  };

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          <img className="h-10 w-10 object-cover" src={item?.imageURL} alt="" />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.name}</td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex gap-1 justify-center">
          <Button
            onClick={handleMoveUp}
            isDisabled={isFirst || isDeleting || isUpdatingOrder}
            isLoading={isUpdatingOrder}
            isIconOnly
            size="sm"
            variant="light"
          >
            <ChevronUp size={13} />
          </Button>
          <Button
            onClick={handleMoveDown}
            isDisabled={isLast || isDeleting || isUpdatingOrder}
            isLoading={isUpdatingOrder}
            isIconOnly
            size="sm"
            variant="light"
          >
            <ChevronDown size={13} />
          </Button>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting || isUpdatingOrder}
            isIconOnly
            size="sm"
          >
            <Edit2 size={13} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting || isUpdatingOrder}
            isIconOnly
            size="sm"
            color="danger"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}