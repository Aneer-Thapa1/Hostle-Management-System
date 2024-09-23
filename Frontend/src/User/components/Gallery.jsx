import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaSpinner,
  FaExclamationCircle,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useSwipeable } from "react-swipeable";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchGalleryImages = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${apiUrl}/api/content/gallery`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Gallery = () => {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const {
    data: images,
    isLoading,
    error,
  } = useQuery("galleryImages", fetchGalleryImages, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
  };

  const closeFullscreen = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    if (fullscreenIndex !== null && fullscreenIndex < images.length - 1) {
      setFullscreenIndex(fullscreenIndex + 1);
    }
  }, [fullscreenIndex, images]);

  const prevImage = useCallback(() => {
    if (fullscreenIndex !== null && fullscreenIndex > 0) {
      setFullscreenIndex(fullscreenIndex - 1);
    }
  }, [fullscreenIndex]);

  const handleKeyDown = useCallback(
    (event) => {
      if (fullscreenIndex === null) return;

      switch (event.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeFullscreen();
          break;
        default:
          break;
      }
    },
    [fullscreenIndex, nextImage, prevImage, closeFullscreen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primaryColor text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <FaExclamationCircle className="mr-2" />
        <span>Error loading gallery: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="bg-boxColor rounded-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Hostel Gallery</h2>
          <p className="text-gray-400 text-sm">
            {images ? images.length : 0} images available
          </p>
        </div>
      </div>
      <div className="p-6">
        {images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.imageUrl}
                  alt={image.description || "Hostel image"}
                  className="w-full h-48 object-cover rounded-lg transition-all duration-300 group-hover:opacity-75"
                />
                <button
                  onClick={() => openFullscreen(index)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FaExpand />
                </button>
                {image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No images available in the gallery at the moment.
          </div>
        )}
      </div>

      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          {...handlers}
        >
          <img
            src={images[fullscreenIndex].imageUrl}
            alt={images[fullscreenIndex].description || "Fullscreen image"}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            <FaTimes />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
            disabled={fullscreenIndex === 0}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
            disabled={fullscreenIndex === images.length - 1}
          >
            <FaChevronRight />
          </button>
          {images[fullscreenIndex].description && (
            <div className="absolute bottom-4 left-4 right-4 text-white text-center bg-black bg-opacity-50 p-2 rounded">
              {images[fullscreenIndex].description}
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {fullscreenIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
