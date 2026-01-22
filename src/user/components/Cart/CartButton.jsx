import React, { useEffect, useState } from "react";
import Api from "../../../utils/Api.js";
import { useDispatch } from "react-redux";
import { incrementCartCount,decrementCartCount } from "../../../redux/features/cart/cartSlice.js";
import { selectCartCount } from "../../../redux/features/cart/cartSlice";


selectCartCount
function CartButton({ productId }) {
  const [count, setCount] = useState(0 );
  const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    // const totalCount = useSelector(selectCartCount)
  // 🟡 Fetch count when component mounts
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setLoading(true);
        const response = await Api.get(
          `${import.meta.env.VITE_CARTSERVICE}/${productId}`
        );
        setCount(response.data?.count || 0);
        // dispatch(incrementCartCount())
      } catch (err) {
        console.warn("Cart item not found, initializing count = 0",err);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductCount();
  }, [productId]);

  
  const increaseCount = async () => {
  if (count >= 6) return;
  setLoading(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 300)); // optional delay

    let response;
    if (count === 0) {
      // Add new item
      console.log(productId)
      response = await Api.post(`${import.meta.env.VITE_CARTSERVICE}/${productId}`,{ quantity: 1 });
      console.log(response)
      dispatch(incrementCartCount());
      setCount(1);
    } else {
      // Update existing item
      response = await Api.put(`${import.meta.env.VITE_CARTSERVICE}/${productId}`, { quantity: count + 1 });
      setCount(prev => Math.min(prev + 1, 6));
    }

    console.log("Cart updated:", response.data);
  } catch (error) {
    console.error("Error updating cart:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  
  const decreaseCount = async () => {
    if (count <= 0) return; // prevent below 0

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (count > 1) {
        const response = await Api.put(
          `${import.meta.env.VITE_CARTSERVICE}/${productId}`,
          { quantity: count - 1 }
        );
        setCount((prev) => prev - 1);
        console.log("Cart updated:", response.data);
      } else if (count === 1) {
        const response = await Api.delete(
          `${import.meta.env.VITE_CARTSERVICE}/${productId}`
        );
        setCount(0);
        dispatch(decrementCartCount())
        console.log("Item removed from cart:", response.data);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 UI
  if (loading)
    return <span className= " flex justify-center items-center text-gray-500">Updating...</span>;

  return (
    <div className="flex items-center gap-2">
      {count <= 0 ? (
        <button
          onClick={increaseCount} // ✅ call backend
          className="px-4 py-2 h-10  rounded-xl transition bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={decreaseCount}
            className="px-3 py-1 w-10 h-10 rounded-xl bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition"
          >
            -
          </button>

          <span className="text-lg font-semibold text-[var(--accent-color)]">
            {count}
          </span>

          <button
            onClick={increaseCount}
            disabled={count >= 6}
            className={`px-3 py-1 w-10 h-10 rounded-xl transition ${
              count >= 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white"
            }`}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default CartButton;
