"use client";

import { useState, useEffect } from "react";
import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";

export default function BasicDetails({ data, handleData }) {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const [productLinks, setProductLinks] = useState([{ title: "", url: "" }]);

  // Initialize product links from data
  useEffect(() => {
    if (data?.links) {
      try {
        const parsedLinks = JSON.parse(data.links);
        if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
          // Check if links have title/url structure or need conversion
          if (typeof parsedLinks[0] === 'object' && parsedLinks[0].hasOwnProperty('title')) {
            setProductLinks(parsedLinks);
          } else {
            // Convert old format to new format
            const formattedLinks = parsedLinks.map(link => ({ 
              title: "Link", 
              url: link 
            }));
            setProductLinks(formattedLinks);
          }
        } else {
          setProductLinks([{ title: "", url: "" }]);
        }
      } catch {
        // If not valid JSON, treat as single link
        setProductLinks([{ title: "Link", url: data.links }]);
      }
    }
  }, [data?.links]);

  // Handle links change and update parent
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...productLinks];
    updatedLinks[index][field] = value;
    setProductLinks(updatedLinks);
    handleData("links", JSON.stringify(updatedLinks));
  };

  // Add new link field
  const addLinkField = () => {
    if (productLinks.length < 10) {
      setProductLinks([...productLinks, { title: "", url: "" }]);
    }
  };

  // Remove link field
  const removeLinkField = (index) => {
    if (productLinks.length > 1) {
      const updatedLinks = productLinks.filter((_, i) => i !== index);
      setProductLinks(updatedLinks);
      handleData("links", JSON.stringify(updatedLinks));
    }
  };

  return (
    <section className="flex-1 flex flex-col gap-3 bg-white rounded-xl p-4 border">
      <h1 className="font-semibold">Basic Details</h1>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-code">
          Product Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Product Code"
          id="product-code"
          name="product-code"
          value={data?.productCode ?? ""}
          onChange={(e) => {
            handleData("productCode", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-title">
          Product Name <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="text"
          placeholder="Enter Title"
          id="product-title"
          name="product-title"
          value={data?.title ?? ""}
          onChange={(e) => {
            handleData("title", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-short-decription"
        >
          Short Description
        </label>
        <input
          type="text"
          placeholder="Enter Short Description"
          id="product-short-decription"
          name="product-short-decription"
          value={data?.shortDescription ?? ""}
          onChange={(e) => {
            handleData("shortDescription", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs">
          Product Links (Max 10)
        </label>
        {productLinks.map((link, index) => (
          <div key={index} className="flex flex-col gap-2 mb-2 border-b pb-2 last:border-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Link {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeLinkField(index)}
                className="text-red-500 px-2 py-1 ml-auto"
              >
                Remove
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Link Title"
                value={link.title}
                onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                className="border px-4 py-2 rounded-lg w-full outline-none"
              />
              <input
                type="text"
                placeholder="Link URL"
                value={link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                className="border px-4 py-2 rounded-lg w-full outline-none"
              />
            </div>
          </div>
        ))}
        {productLinks.length < 10 && (
          <button
            type="button"
            onClick={addLinkField}
            className="text-blue-500 self-start mt-1 text-sm flex items-center gap-1"
          >
            <span>+</span> Add another link
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-brand">
          Brand {/* <span className="text-red-500">*</span>{" "} */}
        </label>
        <select
          type="text"
          id="product-brand"
          name="product-brand"
          value={data?.brandId ?? ""}
          onChange={(e) => {
            handleData("brandId", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        >
          <option value="">Select Brand</option>
          {brands?.map((item) => {
            return (
              <option value={item?.id} key={item?.id}>
                {item?.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-category">
          Category <span className="text-red-500">*</span>{" "}
        </label>
        <select
          type="text"
          id="product-category"
          name="product-category"
          value={data?.categoryId ?? ""}
          onChange={(e) => {
            handleData("categoryId", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        >
          <option value="">Select Category</option>
          {categories?.map((item) => {
            return (
              <option value={item?.id} key={item?.id}>
                {item?.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-stock">
          Stock {/* <span className="text-red-500">*</span>{" "} */}
        </label>
        <input
          type="number"
          placeholder="Enter Stock"
          id="product-stock"
          name="product-stock"
          value={data?.stock ?? ""}
          onChange={(e) => {
            handleData("stock", e.target.valueAsNumber);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-price">
          Price <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Price"
          id="product-price"
          name="product-price"
          value={data?.price ?? ""}
          onChange={(e) => {
            handleData("price", e.target.valueAsNumber);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-sale-price">
          Sale Price
        </label>
        <input
          type="number"
          placeholder="Enter Sale Price"
          id="product-sale-price"
          name="product-sale-price"
          value={data?.salePrice ?? ""}
          onChange={(e) => {
            handleData("salePrice", e.target.valueAsNumber);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-is-featured-product"
        >
          Is Featured Product <span className="text-red-500">*</span>{" "}
        </label>
        <select
          type="number"
          placeholder="Enter Sale Price"
          id="product-is-featured-product"
          name="product-is-featured-product"
          value={data?.isFeatured ? "yes" : "no"}
          onChange={(e) => {
            handleData("isFeatured", e.target.value === "yes" ? true : false);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value={"no"}>No</option>
          <option value={"yes"}>Yes</option>
        </select>
      </div>
    </section>
  );
}