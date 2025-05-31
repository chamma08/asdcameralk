import { createNewBgImage, updateBgImage } from '@/lib/firestore/bgImages/write';
import React, { useState } from 'react';
import toast from "react-hot-toast";

const Form = ({ editingImage, onEditComplete }) => {
  const [formData, setFormData] = useState({
    name: editingImage?.name || '',
    description: editingImage?.description || '',
    isActive: editingImage?.isActive || false
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingImage?.imageURL || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (optional - e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected successfully');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Show loading toast
    const loadingToast = toast.loading(
      editingImage ? 'Updating background image...' : 'Creating background image...'
    );

    try {
      if (editingImage) {
        await updateBgImage({
          data: { ...formData, id: editingImage.id },
          image: selectedImage
        });
        toast.success('Background image updated successfully!', {
          id: loadingToast,
        });
      } else {
        if (!selectedImage) {
          throw new Error('Please select an image');
        }
        await createNewBgImage({
          data: formData,
          image: selectedImage
        });
        toast.success('Background image created successfully!', {
          id: loadingToast,
        });
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        isActive: false
      });
      setSelectedImage(null);
      setImagePreview(null);
      
      if (onEditComplete) {
        onEditComplete();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      toast.error(err.message || 'Something went wrong!', {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      isActive: false
    });
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    toast('Form cancelled', {
      icon: 'ℹ️',
    });
    if (onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editingImage ? 'Edit Background Image' : 'Add New Background Image'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Image Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image name"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image File {!editingImage && '*'}
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Set as active background
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (editingImage ? 'Update Image' : 'Add Image')}
          </button>
          
          {editingImage && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;