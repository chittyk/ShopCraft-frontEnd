import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import imageNotFound from "../../assets/imageNotFound.png";
import CartButton from "../Cart/CartButton";
import Api from "../../utils/Api";
import { useDispatch } from "react-redux";
import { incrementCartCount } from "../../redux/features/cart/cartSlice";
import { decrementWishlistCount, incrementWishlistCount } from "../../redux/features/wishlist/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  // ------------------------------------------------------
  // CHECK IF PRODUCT IS ALREADY IN WISHLIST
  // ------------------------------------------------------
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await Api.get(`${import.meta.env.VITE_WISHLIST}/${product._id}`);
        setWishlisted(res.data.exists === true); // backend must send exists:true
      } catch (err) {
        setWishlisted(false);
      }
    };

    checkWishlist();
  }, [product._id]);

  // ------------------------------------------------------
  // HANDLE WISHLIST ADD / REMOVE
  // ------------------------------------------------------
  const handleWishlist = async () => {
    try {
      if (!wishlisted) {
        await Api.post(`${import.meta.env.VITE_WISHLIST}/${product._id}`);
        dispatch(incrementWishlistCount())
        setWishlisted(true);
      } else {
        await Api.delete(`${import.meta.env.VITE_WISHLIST}/${product._id}`);
        dispatch(decrementWishlistCount())
        setWishlisted(false);
      }
    } catch (error) {
      console.log("Wishlist error:", error);
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-gray-300" />
      )
    );
  };

  return (
    <div
      className={`relative rounded-2xl shadow-md shadow-gray-950 overflow-hidden group transition-all duration-300 
        ${!product.stock ? "opacity-60 grayscale cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1"}
      `}
    >
      {/* Wishlist Icon */}
      <div
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 text-2xl cursor-pointer"
      >
        {wishlisted ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-white" />
        )}
      </div>

      {/* IMAGE */}
      <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
        <img
          src={
            product.thumbnail.url && product.images.length > 0
              ? product.images[0].url
              : imageNotFound
          }
          alt={product.thumbnail.alt}
          className="w-full h-60 object-cover"
        />

        {/* Hover Button */}
        {product.stock && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center mb-[-50px] group-hover:mb-4 transition-all duration-300">
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-[var(--accent-color)] text-white px-5 py-2 rounded-lg shadow-lg hover:bg-[var(--accent-hover)] transition transform hover:scale-105"
            >
              View Details
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.productName}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mt-1">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mt-2">
          {renderStars(product.rate || 0)}
        </div>

        {/* Stock Warning */}
        {product.stock === 0 ? (
          <p className="text-red-500 text-sm mt-1">Out of stock!</p>
        ) : product.stock < 10 ? (
          <p className="text-orange-500 text-sm mt-1">
            Only {product.stock} left!
          </p>
        ) : null}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-[var(--accent-color)]">
              ₹{product.price}
            </span>
          </div>

          {product.stock ? (
            <CartButton productId={product._id} />
          ) : (
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-gray-400 text-gray-700 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
