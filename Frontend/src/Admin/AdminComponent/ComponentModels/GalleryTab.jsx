import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";

const cloudinaryConfig = {
  cloudName: "dwx7fqwrh",
  uploadPreset: "Hostel Management",
};

const GalleryTab = ({ hostelData, setHostelData }) => {
  const { fetchGallery, addGalleryImage, deleteGalleryImage } = useHostelApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (result, error) => {
    if (error) {
      console.error("Error during upload:", error);
      setError("Failed to upload image. Please try again.");
      return;
    }

    console.log("Upload result:", result);

    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      console.log("Upload successful. Image URL:", imageUrl);

      try {
        const addedImage = await addGalleryImage({ url: imageUrl });
        setHostelData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), addedImage],
        }));
      } catch (error) {
        console.error("Error adding image to gallery:", error);
        setError("Failed to add image to gallery. Please try again.");
      }
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

  if (loading) return <div>Loading gallery...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <WidgetLoader />
      <h2 className="text-xl font-bold mb-4">Gallery</h2>
      {Array.isArray(hostelData?.gallery) && hostelData.gallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {hostelData.gallery.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.imageUrl}
                alt="Gallery"
                className="w-full h-32 object-cover rounded"
              />
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No images in the gallery.</p>
      )}
      <div className="mt-4">
        <Widget
          sources={["local"]}
          resourceType={"image"}
          cloudName={cloudinaryConfig.cloudName}
          uploadPreset={cloudinaryConfig.uploadPreset}
          buttonText={"Upload Images"}
          style={{
            color: "white",
            border: "none",
            width: "120px",
            backgroundColor: "#3B82F6",
            borderRadius: "5px",
            height: "40px",
          }}
          folder={"hostel_gallery"}
          cropping={false}
          multiple={true}
          autoClose={false}
          onSuccess={handleImageUpload}
          onFailure={(e) => console.error("Upload failed:", e)}
          logging={true}
          use_filename={false}
          eager={"w_400,h_300,c_pad|w_260,h_200,c_crop"}
        />
      </div>
    </div>
  );
};

export default GalleryTab;
