"use client";

import { useEffect, useState } from "react";

import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import toast from "react-hot-toast";

import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";
import { createNewProduct, updateProduct } from "@/lib/firestore/products/write";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Description";

// Image Upload Guidelines Component
const ImageUploadGuidelines = () => {
  return (
    <Card className="mb-4 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardBody className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <h3 className="font-semibold text-gray-800">Image Upload Guidelines</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Feature Image Guidelines */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-blue-600 flex items-center gap-1">
              🖼️ Feature Image
            </h4>
            <ul className="text-xs space-y-1 text-gray-600">
              <li className="flex items-center gap-1">
                <Chip size="sm" color="success" variant="dot">Recommended: 1200x800px</Chip>
              </li>
              <li className="flex items-center gap-1">
                <Chip size="sm" color="primary" variant="dot">PNG</Chip>
              </li>
              <li className="flex items-center gap-1">
                <Chip size="sm" color="warning" variant="dot">Should remove background</Chip>
              </li>
              <li className="text-gray-500">• High-quality main product shot</li>
              <li className="text-gray-500">• Clean background preferred</li>
            </ul>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-sm text-green-700 mb-2">💡 Pro Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              Good lighting is key
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              Show product in use
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              Consistent style/theme
            </div>
          </div>
        </div>

        {/* Image Quality Checklist */}
        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-gray-600">Quick checklist:</span>
            <Chip size="sm" variant="flat" color="default">Sharp & Clear</Chip>
            <Chip size="sm" variant="flat" color="default">Good Colors</Chip>
            <Chip size="sm" variant="flat" color="default">No Blur</Chip>
            <Chip size="sm" variant="flat" color="default">Proper Size</Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default function Page() {
  const [data, setData] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const returnPage = searchParams.get("page"); // Get the page parameter

  const fetchData = async () => {
    try {
      const res = await getProduct({ id: id });
      if (!res) {
        throw new Error("Product Not Found");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => {
      return {
        ...(prevData ?? {}),
        [key]: value,
      };
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewProduct({
        data: data,
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product is successfully Created!");
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProduct({
        data: data,
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product is successfully Updated!");
      
      // Redirect back to the specific page where the product was listed
      const redirectUrl = returnPage 
        ? `/admin/products?page=${returnPage}` 
        : `/admin/products`;
      router.push(redirectUrl);
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-5">
      {/* Guidelines Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          variant="ghost"
          color="danger"
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="text-xs"
        >
          {showGuidelines ? "Hide Guidelines" : "Show Image Guidelines"}
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex justify-between w-full items-center">
          <h1 className="font-semibold text-xl">
            {id ? "Update Product" : "Create New Product"}
          </h1>
          <Button 
            isLoading={isLoading} 
            isDisabled={isLoading} 
            type="submit"
            color="default"
            size="lg"
            className="px-8"
          >
            {id ? "Update Product" : "Create Product"}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex">
            <BasicDetails data={data} handleData={handleData} />
          </div>
          <div className="flex-1 flex flex-col gap-5 h-full">
            <Images
              data={data}
              featureImage={featureImage}
              setFeatureImage={setFeatureImage}
              imageList={imageList}
              setImageList={setImageList}
            />
            
            {/* Image Upload Guidelines - Positioned below Images component */}
            {showGuidelines && <ImageUploadGuidelines />}
            
            <Description data={data} handleData={handleData} />
          </div>
        </div>
      </form>
    </div>
  );
}