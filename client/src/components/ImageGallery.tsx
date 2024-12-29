import React, { useEffect, useState } from "react";

type images = {
  url: string;
  name: string;
  size: number;
  lastModified: string;
};

const ImageGallery: React.FC = () => {
  const url =
    import.meta.env.VITE_NODE_ENV == "production"
      ? import.meta.env.VITE_PROD_BACKEND_URL
      : import.meta.env.VITE_DEV_BACKEND_URL;

  const [images, setImages] = useState<images[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/api/get-all-images");
      const data = await response.json();
      if (response.ok) {
        setImages(data.data);
        setError(null);
      } else {
        setError("Some Error Occurred");
        console.error("Failed to fetch images:", data);
      }
    } catch (error) {
      setError("Some Error Occurred");
      console.error("Failed to fetch images:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
      {error == null && images.length === 0 ? (
        <p className="text-gray-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border shadow"
            >
              <img
                src={image.url}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {error && <div className="text-red-500 font-bold">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
