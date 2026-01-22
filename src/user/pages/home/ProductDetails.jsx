import React, { useEffect, useState } from "react";
import { ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { data, useParams } from "react-router-dom";
import Api from "../../../utils/Api";
import Rating from "../../components/ReviewAndRateing/Rating";
import CartButton from "../../components/Cart/CartButton";
import BuyNowButton from "../../components/Buy/BuyNowButton";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await Api.get(
          `${import.meta.env.VITE_PRODUCTSERVICE}/${id}`
        );
        setProduct(response.data);
        console.log("product serviice", response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-gray-400 text-lg">Loading product...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-gray-400 text-lg">Product not found.</p>
      </div>
    );

  const {
    productName,
    description,
    price,
    oldPrice,
    stock,
    tags,
    features,
    brand,
    category,
    thumbnail,
    images,
    ratings,
  } = product;

  // Calculate total average rating if available
  const totalRatings =
    ratings && Object.values(ratings).reduce((a, b) => a + b, 0);
  const weightedRating =
    ratings &&
    totalRatings > 0 &&
    (
      Object.entries(ratings).reduce(
        (sum, [star, count]) => sum + Number(star) * count,
        0
      ) / totalRatings
    ).toFixed(1);

  const discountPercent =
    oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900" style={{}}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 🖼️ Left - Image Gallery */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Thumbnail List */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible order-2 sm:order-1">
              {(images && images.length > 0 ? images : [thumbnail]).map(
                (img, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600 hover:border-[var(--accent-color)] transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={img?.url || img}
                      alt={img?.alt || `Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>

            <div className="flex-1 min-h-[400px] max-h-[600px] bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <img
                src={
                  images?.[0]?.url ||
                  thumbnail?.url ||
                  "https://via.placeholder.com/800x800/374151/ffffff?text=No+Image"
                }
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* 🛍️ Right - Product Info */}
          <div className="flex flex-col">
            {/* Category & Stock */}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[var(--accent-color)] text-white text-sm font-medium rounded-full capitalize">
                {category || "Uncategorized"}
              </span>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stock > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    stock > 0 ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              {productName}
            </h1>

            {/* Brand */}
            <p className="text-sm text-gray-400 mb-4">Brand: {brand}</p>

            {/* ⭐ Guest Ratings & Reviews */}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl  font-bold text-white">
                ₹{price?.toLocaleString()}
              </span>
              <span className="text-2xl text-gray-500 line-through">
                ₹{oldPrice?.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="px-3 py-1 bg-green-900 text-green-300 text-sm font-semibold rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-6">{description}</p>

            {/* Features */}
            {features?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Key Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col h-10 sm:flex-row gap-3 mb-8">
              <div className="min-w-30">
                <CartButton productId={product._id}></CartButton>
              </div>
              <BuyNowButton productId={product._id}></BuyNowButton>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Shield, label: "2 Year Warranty" },
                { icon: RotateCcw, label: "30-Day Returns" },
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--accent-color)]" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* ⭐ Rating Section (Full Width Below Product Info) */}
          {product.ratings &&
            Object.values(product.ratings).some((count) => count > 0) && (
              <div className="mt-10  rounded-2xl shadow-lg p-8 col-span-full w-full">
                <Rating ratings={product.ratings} productId={product._id} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
