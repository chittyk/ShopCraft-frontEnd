import React, { useState } from "react";
import { Heart } from "lucide-react"; // ❤️ icon import

function ProductImage({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!product || !product.images) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-xl text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* 🖼️ Thumbnails - Left Side */}
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible order-2 sm:order-1">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
              selectedImage === idx
                ? "border-[var(--accent-color)] shadow-md"
                : "border-gray-600 hover:border-gray-500"
            }`}
          >
            <img
              src={img.url || img}
              alt={img.alt || `Product ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* 🌟 Main Image */}
      <div className="flex-1 relative group order-1 sm:order-2">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-700">
          <img
            src={product.images[selectedImage].url || product.images[selectedImage]}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* ❤️ Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-3 bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-300"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductImage;
