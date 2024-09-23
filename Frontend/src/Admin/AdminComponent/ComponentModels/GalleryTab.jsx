import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";

const cloudinaryConfig = {
  cloudName: "dwx7fqwrh",
  uploadPreset: "Hostel Management",
};

const GalleryTab = ({ hostelData, setHostelData }) => {
  const {
    fetchGallery,
    addGalleryImage,
    deleteGalleryImage,
    updateGalleryImage,
  } = useHostelApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const gallery = await fetchGallery();
      setHostelData((prev) => ({ ...prev, gallery: gallery || [] }));
    } catch (error) {
      console.error("Error loading gallery:", error);
      setError("Failed to load gallery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (result) => {
    if (result.event !== "success") return;

    const imageUrl = result.info.secure_url;
    setNewImageUrl(imageUrl);
    setShowDescriptionModal(true);
  };

  const handleAddImageWithDescription = async () => {
    try {
      const addedImage = await addGalleryImage({
        imageUrl: newImageUrl,
        description: newImageDescription,
      });
      setHostelData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), addedImage],
      }));
      setShowDescriptionModal(false);
      setNewImageUrl("");
      setNewImageDescription("");
    } catch (error) {
      console.error("Error adding image to gallery:", error);
      setError("Failed to add image to gallery. Please try again.");
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await deleteGalleryImage(id);
      setHostelData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((image) => image.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image. Please try again.");
    }
  };

  const handleEditDescription = async (id) => {
    try {
      await updateGalleryImage(id, { description: editDescription });
      setHostelData((prev) => ({
        ...prev,
        gallery: prev.gallery.map((image) =>
          image.id === id ? { ...image, description: editDescription } : image
        ),
      }));
      setEditingId(null);
      setEditDescription("");
    } catch (error) {
      console.error("Error updating image description:", error);
      setError("Failed to update image description. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading gallery...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WidgetLoader />
      <h2 className="text-2xl font-bold text-gray-800">Gallery</h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {Array.isArray(hostelData?.gallery) && hostelData.gallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hostelData.gallery.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            >
              <img
                src={image.imageUrl}
                alt="Gallery"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                {editingId === image.id ? (
                  <>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full mb-2 p-1 text-black"
                      placeholder="Enter description"
                    />
                    <button
                      onClick={() => handleEditDescription(image.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-full mb-2"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-white text-sm mb-2">
                      {image.description || "No description"}
                    </p>
                    <button
                      onClick={() => {
                        setEditingId(image.id);
                        setEditDescription(image.description || "");
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-full mb-2"
                    >
                      Edit
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            No images in the gallery yet.
          </p>
        </div>
      )}

      <div className="mt-6">
        <Widget
          sources={["local"]}
          resourceType={"image"}
          cloudName={cloudinaryConfig.cloudName}
          uploadPreset={cloudinaryConfig.uploadPreset}
          buttonText={"Upload Images"}
          style={{
            color: "white",
            border: "none",
            width: "100%",
            backgroundColor: "#3B82F6",
            borderRadius: "0.375rem",
            height: "2.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
          folder={"hostel_gallery"}
          cropping={false}
          multiple={false}
          autoClose={false}
          onSuccess={handleImageUpload}
          onFailure={(e) => setError("Upload failed. Please try again.")}
          logging={true}
          use_filename={false}
          eager={"w_400,h_300,c_pad|w_260,h_200,c_crop"}
        />
      </div>

      {showDescriptionModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add Image Description
              </h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  value={newImageDescription}
                  onChange={(e) => setNewImageDescription(e.target.value)}
                  placeholder="Enter image description"
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleAddImageWithDescription}
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
