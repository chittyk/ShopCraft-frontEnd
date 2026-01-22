import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import CartIcon from '../../user/components/Cart/CartIcon';
import { UserIcon } from 'lucide-react';
import WishlistIcon from '../../user/components/WishList/WishlistIcon';

function Navbar
() {
    
  const navigate = useNavigate();
  const pathnames = ["/SignUp", "/forgetPassword", "/login"];
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const SearchIcon = FaSearch;
  // const CartIcon = FaShoppingCart;
  const BarsIcon = FaBars;
  const TimesIcon = FaTimes;

  useEffect(() => {
    if (pathnames.includes(location.pathname)) {
      setIsTransparent(false);
    } else {
      setIsTransparent(true);
    }
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary/80 backdrop-blur-lg border-b border-gray-700 shadow-xl z-50 transition-all duration-300">
      <div className="container mx-auto flex h-18 items-center justify-between px-6 py-3 relative">
        {/* Logo */}
        {/* Applied .text-primary, .text-accent, and .hover-text-accent */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-primary tracking-wider cursor-pointer hover-text-accent transition duration-300 z-10"
        >
          <span className="text-accent">Shop</span>CraftAdmin
        </div>

        {/* Search */}
        {isTransparent && (
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden  lg:flex w-2/5">
            <div className="relative w-full">
              {/* Applied .text-placeholder-color to the icon */}
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-placeholder-color" />
              <input
                type="text"
                placeholder="Search for products..."
                // Applied .bg-secondary, .text-base-color, and .focus-ring-accent
                className="pl-10 pr-4 py-2 w-full text-sm bg-secondary text-base-color border border-gray-700 rounded-full shadow-sm focus-ring-accent focus:ring-2 focus-border-accent:focus outline-none transition-all hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Right Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          {isTransparent && <WishlistIcon />}
          {isTransparent && <CartIcon />}
          <UserIcon />
        </div>

        {/* Mobile Toggle */}
        {/* Applied .text-primary and .hover-text-accent */}
        <div
          className="lg:hidden text-primary h-6 w-6 cursor-pointer z-10 hover-text-accent transition duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <TimesIcon className="h-full w-full" />
          ) : (
            <BarsIcon className="h-full w-full" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        // Applied .bg-secondary and .text-base-color
        <div className="lg:hidden bg-secondary border-t border-gray-800 shadow-md flex flex-col px-6 py-4 space-y-4 font-medium text-base-color transition-all">
          {/* Search */}
          {isTransparent && (
            <div className="relative">
              {/* Applied .text-placeholder-color to the icon */}
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-placeholder-color" />
              <input
                type="text"
                placeholder="Search for products..."
                // Applied .bg-secondary, .text-base-color, and .focus-ring-accent
                className="pl-10 pr-4 py-2 w-full text-sm bg-secondary text-base-color border border-gray-700 rounded-full shadow-sm focus-ring-accent focus:ring-2 outline-none transition-all hover:shadow-md focus:shadow-lg"
              />
            </div>
          )}

          {/* Icons */}
          <div className="flex items-center justify-end space-x-4 mt-3">
            {/* Applied .hover-text-accent */}
            {isTransparent && (
              <>
                <div className="flex items-center space-x-2 cursor-pointer group transition-colors duration-300">
                  <WishlistIcon className="group-hover:text-[var(--accent-color)]" />
                  <span className="group-hover:text-[var(--accent-color)]">
                    Wish List
                  </span>
                </div>

                <div className="flex items-center space-x-2 cursor-pointer group transition-colors duration-300">
                  <CartIcon className="group-hover:text-[var(--accent-color)]" />
                  <span className="group-hover:text-[var(--accent-color)]">
                    Cart
                  </span>
                </div>
              </>
            )}
            <div className="flex items-center space-x-2 cursor-pointer hover-text-accent transition-colors duration-300">
              <UserIcon />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar

