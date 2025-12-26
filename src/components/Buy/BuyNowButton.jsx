import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../utils/Api";
import { useDispatch } from "react-redux";
import { incrementCartCount } from "../../redux/features/cart/cartSlice";

function BuyNowButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyNow = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      // 🛒 Step 1: Check if item exists in cart
      const res = await Api.get(
        `${import.meta.env.VITE_CARTSERVICE}/${productId}`
      );
      const existingCount = res.data?.count || 0;

      // 🛒 Step 2: Add or update cart item
      if (existingCount === 0) {
        await Api.post(`${import.meta.env.VITE_CARTSERVICE}/${productId}`, {
          quantity: 1,
        });
        dispatch(incrementCartCount());
      } else {
        await Api.put(`${import.meta.env.VITE_CARTSERVICE}/${productId}`, {
          quantity: existingCount + 1,
        });
      }

      // ✅ Step 3: Redirect to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error during Buy Now:", error.response?.data || error.message);
      alert("Something went wrong while processing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={loading}
      className={`flex-1  rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
        loading
          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
          : "border-2 border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white hover:shadow-lg hover:scale-[1.02]"
      }`}
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}

export default BuyNowButton;
