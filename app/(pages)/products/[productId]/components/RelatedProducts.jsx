

import { ProductCard } from "@/app/components/Products";
import { getProductsByCategory, getProductsByCategories } from "@/lib/firestore/products/read_server";

export default async function RelatedProducts({ product }) {
  // Get categories from the product - support both new and old format
  const getProductCategories = () => {
    if (product?.categoryIds && Array.isArray(product.categoryIds)) {
      return product.categoryIds;
    } else if (product?.categoryId) {
      return [product.categoryId]; // Convert single category to array for backward compatibility
    }
    return [];
  };

  const categories = getProductCategories();

  // Don't render if no categories
  if (categories.length === 0) {
    return null;
  }

  let products = [];

  try {
    if (categories.length === 1) {
      // Use single category function for better performance when only one category
      products = await getProductsByCategory({ categoryId: categories[0] });
    } else {
      // Use multiple categories function when product has multiple categories
      products = await getProductsByCategories({ categoryIds: categories });
    }

    // Filter out the current product from related products
    if (product?.id) {
      products = products.filter(item => item.id !== product.id);
    }

    // Limit to maximum 12 related products
    products = products.slice(0, 12);

  } catch (error) {
    console.error("Error fetching related products:", error);
    return null;
  }

  // Don't render if no related products found
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <div className="text-center">
          <h1 className="font-semibold text-lg">Suggestions</h1>
          {categories.length > 1 && (
            <p className="text-sm text-gray-600 mt-1">
              Products from similar categories
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </div>
  );
}

// Alternative component for when you want to show related products by specific category
export async function RelatedProductsByCategory({ categoryId, excludeProductId, maxProducts = 12 }) {
  if (!categoryId) return null;

  try {
    let products = await getProductsByCategory({ categoryId });

    // Filter out the excluded product
    if (excludeProductId) {
      products = products.filter(item => item.id !== excludeProductId);
    }

    // Limit products
    products = products.slice(0, maxProducts);

    if (!products || products.length === 0) {
      return null;
    }

    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col gap-5 max-w-[900px] p-5">
          <h1 className="text-center font-semibold text-lg">Related Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((item) => {
              return <ProductCard product={item} key={item?.id} />;
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching related products by category:", error);
    return null;
  }
}

// Component for showing products that share ALL categories with the current product
export async function RelatedProductsByAllCategories({ product, maxProducts = 8 }) {
  const getProductCategories = () => {
    if (product?.categoryIds && Array.isArray(product.categoryIds)) {
      return product.categoryIds;
    } else if (product?.categoryId) {
      return [product.categoryId];
    }
    return [];
  };

  const categories = getProductCategories();

  if (categories.length === 0) return null;

  try {
    const { getProductsByAllCategories } = await import("@/lib/firestore/products/read_server");
    let products = await getProductsByAllCategories({ categoryIds: categories });

    // Filter out the current product
    if (product?.id) {
      products = products.filter(item => item.id !== product.id);
    }

    // Limit products
    products = products.slice(0, maxProducts);

    if (!products || products.length === 0) {
      return null;
    }

    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col gap-5 max-w-[900px] p-5">
          <div className="text-center">
            <h1 className="font-semibold text-lg">Similar Products</h1>
            <p className="text-sm text-gray-600 mt-1">
              Products matching all categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((item) => {
              return <ProductCard product={item} key={item?.id} />;
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching products by all categories:", error);
    return null;
  }
}