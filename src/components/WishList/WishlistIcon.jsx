import React, { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Api from "../../utils/Api";
import {
  setWishlistCount,
} from "../../redux/features/wishlist/wishlistSlice";
import { selectWishlistCount } from "../../redux/features/wishlist/wishlistSelectors";

function WishlistIcon() {
  const wishlistCount = useSelector(selectWishlistCount);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const response = await Api.get(
          `${import.meta.env.VITE_WISHLIST}`
        );

        dispatch(setWishlistCount(response?.data?.count || 0));

        console.log(
          "Wishlist count fetched:",
          `${import.meta.env.VITE_WISHLIST}`,
          response.data
        );
      } catch (error) {
        console.error("Failed to fetch wishlist count:", error);
      }
    };

    fetchWishlistCount();
  }, [dispatch]);

  // Hide if user not logged in
  if (!localStorage.getItem("token")) return null;

  return (
  <div className="relative flex items-center cursor-pointer group">
      {/* Heart Icon */}
      <FaHeart
        className="h-6 w-6 text-white 
                   transition-all duration-300
                   group-hover:text-[var(--accent-color)]
                   group-hover:scale-110"
      />

      {/* Badge */}
      <div
        className="absolute -top-2 -right-3 w-5 h-5 
                   flex items-center justify-center 
                   rounded-full bg-[var(--accent-color)]
                   text-[13px] text-white font-semibold

                   transition-all duration-300
                   group-hover:bg-white 
                   group-hover:text-black 
                   group-hover:scale-110"
      >
        {wishlistCount}
      </div>
  </div>
);

}

export default WishlistIcon;
