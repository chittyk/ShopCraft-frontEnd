import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { BsBoxSeam } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { IoMdPower } from "react-icons/io";
import { selectUserEmail, selectUserName } from "../../../redux/features/user/userSelectors";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../../../redux/features/user/userSlice";
import { persistor } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

function UserIcon() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);

  const [showDropdown, setShowDropdown] = React.useState(false);
  const hideTimeoutRef = React.useRef(null);

  const isLoggedIn = Boolean(name && email); // derive from Redux

  const handleLogout = () => {
    localStorage.removeItem("token");    // clear token first
    dispatch(clearUserInfo());           // clear Redux state
    persistor.purge();                   // clear persisted storage
    setShowDropdown(false);              // close dropdown
    navigate('/')      // redirect to login page
  };

  const handleNavSignin = ()=>{
    navigate('/login')
  }

  const openDropdown = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowDropdown(true);
  };

  const closeDropdownWithDelay = (delay = 120) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowDropdown(false), delay);
  };

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={openDropdown}
      onMouseLeave={() => closeDropdownWithDelay(80)}
      onClick={() => setShowDropdown((s) => !s)}
    >
      {/* Trigger */}
      <div className="flex items-center gap-2 p-2 rounded-xl font-semibold shadow-[var(--accent-color)] cursor-pointer transition hover:bg-secondary select-none">
        <FaUserCircle
          className="text-base-color h-6 w-6 transition-transform transform hover:scale-110 hover:text-[var(--accent-color)]"
          title="User Account"
        />
        {isLoggedIn ? (
          <div className="flex items-center gap-1">
            <span className="text-gray-400">@</span>
            <h1 className="font-thin hover:font-bold text-[var(--base-color)] hover:text-[var(--accent-hover)] transition">
              {name}
            </h1>
          </div>
        ) : (
          <h1 onClick={handleNavSignin} className="text-[var(--primary-color)] hover:text-[var(--accent-hover)] transition">
            Sign In
          </h1>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 top-full mt-1 w-64 bg-secondary rounded-xl shadow-lg border border-[var(--accent-border)] transition-all duration-200 z-50"
          onMouseEnter={openDropdown}
          onMouseLeave={() => closeDropdownWithDelay(80)}
        >
          <ul className="text-sm text-base-color">
            {isLoggedIn ? (
              <li className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl hover:bg-[var(--primary-bg)] hover:text-accent transition-all duration-200">
                <div className="flex">
                  <p className="text-gray-400">@</p>
                  <h1 className="font-thin hover:text-[var(--accent-border)]">{email}</h1>
                </div>
              </li>
            ) : (
              <li onClick={handleNavSignin}  className="px-4 py-2 rounded-tl-2xl cursor-default rounded-tr-2xl hover:bg-[var(--primary-bg)] hover:text-accent transition-all duration-200">
                <div className="flex items-center justify-between">
                  New Customer?
                  <button className="font-semibold cursor-pointer hover:font-bold text-lg text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                    Sign Up
                  </button>
                </div>
              </li>
            )}
            <hr />
            <li className="px-4 py-2 flex cursor-pointer items-center gap-3 hover:bg-[var(--primary-bg)] hover:text-accent transition-all duration-200">
              <VscAccount className="h-6 w-6 text-[var(--accent-color)]" />
              My Profile
            </li>
            <li className="px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-[var(--primary-bg)] hover:text-accent transition-all duration-200">
              <BsBoxSeam className="h-6 w-6 text-[var(--accent-color)]" />
              Orders
            </li>
            <li className="px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-[var(--primary-bg)] hover:text-accent transition-all duration-200">
              <FaRegHeart className="h-6 w-6 text-[var(--accent-color)]" />
              Wishlist
            </li>

            {isLoggedIn && (
              <li
                onClick={handleLogout}
                className="px-4 py-2 cursor-pointer flex items-center gap-3 text-[var(--accent-color)] rounded-2xl hover:bg-[var(--primary-bg)] hover:text-[var(--accent-hover)] transition-all duration-200"
              >
                <IoMdPower className="h-6 w-6 text-[var(--accent-color)]" />
                Logout
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserIcon;
