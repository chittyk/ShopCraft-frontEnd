import React, { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { selectCartCount } from "../../redux/features/cart/cartSelectors";
import Api from "../../utils/Api";
import { setCartCount } from "../../redux/features/cart/cartSlice";

function CartIcon() {
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  useEffect(() => {
    const getCartQuantity = async () => {
      try {
        const response = await Api.get(
          `${import.meta.env.VITE_CARTSERVICE}/${
            import.meta.env.VITE_CARTQUANTITY
          }`
        );
        dispatch(setCartCount(response?.data?.quantity));
        // console.log((response.))
        console.log(
          " Cart quantity fetched:",
          `${import.meta.env.VITE_CARTSERVICE}/${
            import.meta.env.VITE_CARTQUANTITY
          }`,
          response.data
        );
      } catch (error) {
        console.error(" Failed to fetch cart quantity:", error);
      }
    };
    getCartQuantity();
  }, []);

  if (!localStorage.getItem("token")) return null; // only show if logged in

  return (
    <div className="relative flex items-center space-x-2 cursor-pointer group transition-colors duration-300">
      {/* Cart Icon */}
      <FaShoppingCart className="h-6 w-6 text-white transition-colors duration-300 group-hover:text-[var(--accent-color)]" />

      {/* Badge */}
      <div
        className="absolute -top-2 -right-1 w-5 h-5 flex items-center justify-center 
                  rounded-full bg-[var(--accent-color)] text-[13px] text-white font-semibold 
                  transition-all duration-300 
                  group-hover:bg-white group-hover:text-black group-hover:scale-110"
      >
        {cartCount}
      </div>
    </div>
  );
}

export default CartIcon;
