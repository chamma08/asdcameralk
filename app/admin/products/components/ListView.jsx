"use client";

import { useProducts } from "@/lib/firestore/products/read";
import { useCategories } from "@/lib/firestore/categories/read";
import { useBrands } from "@/lib/firestore/brands/read";
import { deleteProduct } from "@/lib/firestore/products/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2, Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current page from URL, default to 1
  const urlPage = parseInt(searchParams.get('page')) || 1;
  
  const [pageLimit, setPageLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(urlPage);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Sync URL page with component state on mount
  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);

  // Update URL when page changes
  const updateURL = (page) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/admin/products${newUrl}`, { scroll: false });
  };

  // Fetch all data for filtering
  const {
    data: allProducts,
    error,
    isLoading,
  } = useProducts({
    pageLimit: 100, // Get more products for better filtering
    lastSnapDoc: null, // Don't use pagination when filtering
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!allProducts) return [];
    
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 ||
                             (product.categoryIds && selectedCategories.some(cat => product.categoryIds.includes(cat)));
      
      const matchesBrand = selectedBrands.length === 0 ||
                          (product.brandIds && selectedBrands.some(brand => product.brandIds.includes(brand))) ||
                          selectedBrands.includes(product.brand);
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
        break;
      case 'title':
        filtered = filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'stock':
        filtered = filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      case 'newest':
      default:
        filtered = filtered.sort((a, b) => {
          const aTime = a.timestampCreate?.seconds || 0;
          const bTime = b.timestampCreate?.seconds || 0;
          return bTime - aTime;
        });
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategories, selectedBrands, sortBy]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageLimit);

  // Paginate the filtered results
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, pageLimit]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateURL(nextPage);
    }
  };

  const handlePrePage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      updateURL(prevPage);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
    updateURL(1);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    resetPagination(); // Reset to page 1 when filters change
  };

  const toggleBrand = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    );
    resetPagination(); // Reset to page 1 when filters change
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchTerm('');
    resetPagination();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    resetPagination(); // Reset to page 1 when search changes
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    resetPagination(); // Reset to page 1 when sort changes
  };

  const handlePageLimitChange = (e) => {
    setPageLimit(Number(e.target.value));
    resetPagination(); // Reset to page 1 when page limit changes
  };

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedBrands.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 md:pr-5 md:px-0 px-5 rounded-xl w-full">
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                <span className="bg-white text-blue-500 text-xs px-2 py-1 rounded-full font-semibold">
                  {selectedCategories.length + selectedBrands.length}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="title">Title A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategories.map(catId => {
              const category = categories?.find(c => c.id === catId);
              return (
                <span
                  key={catId}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {category?.name || catId}
                  <button onClick={() => toggleCategory(catId)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {selectedBrands.map(brandId => {
              const brand = brands?.find(b => b.id === brandId);
              return (
                <span
                  key={brandId}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {brand?.name || brandId}
                  <button onClick={() => toggleBrand(brandId)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={clearFilters}
              className="text-red-500 text-sm hover:text-red-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3 text-gray-800">Categories</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categoriesLoading ? (
                    <div>Loading categories...</div>
                  ) : categories && categories.length > 0 ? (
                    categories.map(category => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="accent-blue-500"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No categories available</p>
                  )}
                </div>
              </div>

              {/* Brands */}
              {brands && brands.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-gray-800">Brands</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {brandsLoading ? (
                      <div>Loading brands...</div>
                    ) : (
                      brands.map(brand => (
                        <label
                          key={brand.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.id)}
                            onChange={() => toggleBrand(brand.id)}
                            className="accent-blue-500"
                          />
                          <span>{brand.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600 mt-4">
          Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-gray-50">
                <th className="font-semibold px-4 py-3 text-left">SN</th>
                <th className="font-semibold px-4 py-3 text-left">Image</th>
                <th className="font-semibold px-4 py-3 text-left">Title</th>
                <th className="font-semibold px-4 py-3 text-left">Price</th>
                <th className="font-semibold px-4 py-3 text-left">Stock</th>
                <th className="font-semibold px-4 py-3 text-left">Orders</th>
                <th className="font-semibold px-4 py-3 text-left">Status</th>
                <th className="font-semibold px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    {hasActiveFilters ? 'No products match your filters' : 'No products found'}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((item, index) => (
                  <Row
                    index={index + (currentPage - 1) * pageLimit}
                    item={item}
                    key={item?.id}
                    currentPage={currentPage}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm py-3 bg-white px-4 rounded-xl shadow-sm">
        <Button
          isDisabled={isLoading || currentPage === 1}
          onClick={handlePrePage}
          size="sm"
          variant="bordered"
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-4">
          <select
            value={pageLimit}
            onChange={handlePageLimitChange}
            className="px-3 py-1 rounded border border-gray-200 text-sm"
            name="perpage"
            id="perpage"
          >
            <option value={3}>3 Items</option>
            <option value={5}>5 Items</option>
            <option value={10}>10 Items</option>
            <option value={20}>20 Items</option>
            <option value={50}>50 Items</option>
          </select>
          
          <span className="text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        <Button
          isDisabled={isLoading || currentPage >= totalPages}
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Row({ item, index, currentPage }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteProduct({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/products/form?id=${item?.id}&page=${currentPage}`);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-center">{index + 1}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <img
            className="h-12 w-12 object-cover rounded-lg"
            src={item?.featureImageURL}
            alt=""
          />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium">{item?.title}</span>
          {item?.isFeatured === true && (
            <span className="inline-flex items-center mt-1 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-xs rounded-full px-2 py-1 w-fit">
              Featured
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          {item?.salePrice < item?.price && (
            <span className="text-xs text-gray-500 line-through">
              LKR {item?.price?.toLocaleString()}
            </span>
          )}
          <span className="font-semibold">LKR {item?.salePrice?.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium">{item?.stock}</span>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium">{item?.orders ?? 0}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex">
          {item?.stock - (item?.orders ?? 0) > 0 ? (
            <div className="px-3 py-1 text-xs text-green-700 bg-green-100 font-semibold rounded-full">
              Available
            </div>
          ) : (
            <div className="px-3 py-1 text-xs text-red-700 bg-red-100 font-semibold rounded-full">
              Out Of Stock
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            variant="ghost"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            color="danger"
            variant="ghost"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}