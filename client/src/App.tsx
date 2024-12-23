import React from "react";
import ImageUploader from "./components/ImageUploader";
import ImageGallery from "./components/ImageGallery";
import "./App.css";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
        <h1 className="text-3xl font-bold mb-6">S3 Image Manager</h1>
        <ImageUploader />
        <ImageGallery />
      </div>
    </>
  );
};

export default App;
