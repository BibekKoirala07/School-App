import React, { useState } from "react";
import axios from "axios";

const ImageUploader: React.FC = () => {
  const fullURL =
    import.meta.env.VITE_NODE_ENV == "production"
      ? import.meta.env.VITE_PROD_BACKEND_URL
      : import.meta.env.VITE_DEV_BACKEND_URL;

  console.log("fullURL", fullURL);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await axios.post(
        fullURL + "/api/generate-presigned-url",
        {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }
      );

      const { url } = response.data;

      await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      alert("Image uploaded successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 w-full border p-2 rounded"
      />

      {previewUrl && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Selected Image:</h3>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto rounded border"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition"
        disabled={!selectedFile}
      >
        Upload Image
      </button>
    </div>
  );
};

export default ImageUploader;