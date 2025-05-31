import { useBgImages } from '@/lib/firestore/bgImages/read';
import { deleteBgImage, updateBgImage } from '@/lib/firestore/bgImages/write';
import React, { useState } from 'react';
import toast from "react-hot-toast";

const ListView = ({ onEditImage }) => {
  const { data: images, error, isLoading } = useBgImages();
  const [deletingId, setDeletingId] = useState(null);
  const [settingActiveId, setSettingActiveId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setDeletingId(id);
      const loadingToast = toast.loading('Deleting image...');
      
      try {
        await deleteBgImage({ id });
        toast.success('Image deleted successfully!', {
          id: loadingToast,
        });
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image. Please try again.', {
          id: loadingToast,
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSetActive = async (image) => {
    setSettingActiveId(image.id);
    const loadingToast = toast.loading('Setting active background...');
    
    try {
      // First, set all other images to inactive
      const updatePromises = images
        .filter(img => img.id !== image.id && img.isActive)
        .map(img => updateBgImage({
          data: { ...img, isActive: false },
          image: null
        }));
      
      await Promise.all(updatePromises);
      
      // Then set the selected image as active
      await updateBgImage({
        data: { ...image, isActive: true },
        image: null
      });
      
      toast.success(`"${image.name}" is now the active background!`, {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Error setting active image:', error);
      toast.error('Failed to set active background. Please try again.', {
        id: loadingToast,
      });
    } finally {
      setSettingActiveId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading images...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Error loading images</div>
          <div className="text-gray-500 text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Background Images</h2>
      
      {!images || images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No images found</div>
          <div className="text-sm">Upload your first background image to get started</div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {images.map((image) => (
            <div
              key={image.id}
              className={`border rounded-lg p-4 transition-all ${
                image.isActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={image.imageURL}
                    alt={image.name}
                    className="w-20 h-20 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png'; // Add a placeholder image
                      toast.error('Failed to load image preview');
                    }}
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 flex items-center gap-2">
                        {image.name}
                        {image.isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </h3>
                      {image.description && (
                        <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Created: {image.timestampCreate?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        {image.timestampUpdate && (
                          <span className="ml-2">
                            | Updated: {image.timestampUpdate?.toDate?.()?.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSetActive(image)}
                      disabled={image.isActive || settingActiveId === image.id}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        image.isActive
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                      }`}
                    >
                      {settingActiveId === image.id ? 'Setting...' : (image.isActive ? 'Active' : 'Set Active')}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (onEditImage) {
                          onEditImage(image);
                          toast('Editing mode activated', {
                            icon: '✏️',
                          });
                        }
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(image.id)}
                      disabled={deletingId === image.id}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === image.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;