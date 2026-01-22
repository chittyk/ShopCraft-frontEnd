import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  Settings,
  Layers 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  // redirect function
  const HandleRedirect = (path) => {
    setActive(path);
    navigate(`admin/${path}`);
  };

  const itemBase =
    "group flex items-center gap-4 px-4 py-2 cursor-pointer " +
    "transition-all duration-200 ease-in-out " +
    "rounded-bl-2xl rounded-tl-2xl " +
    "hover:bg-slate-800 hover:scale-[1.03] hover:text-accent";

  const activeStyle = "bg-primary text-accent scale-[1.03]";

  return (
    <div
      className={`bg-[#020618] h-screen py-15 text-slate-200 overflow-hidden
      transition-[width] duration-300 ease-in-out
      ${open ? "w-[200px]" : "w-[60px]"}`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setOpen(!open)}
          className="hover:text-white transition-colors duration-200"
        >
          {open ? (
            <ChevronLeft className="w-8 h-8" />
          ) : (
            <ChevronRight className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Menu */}
      <ul className="mt-1 space-y-4">
        {/* Dashboard */}
        <li
          onClick={() => HandleRedirect("dashboard")}
          className={`${itemBase} ${
            active === "dashboard" ? activeStyle : ""
          }`}
        >
          <Home
            className={`w-6 h-10 transition-all duration-200
            ${!open ? "mx-auto group-hover:scale-110" : "group-hover:scale-110"}`}
          />
          {open && <span>Dashboard</span>}
        </li>

        {/* Products */}
        <li
          onClick={() => HandleRedirect("category")}
          className={`${itemBase} ${
            active === "products" ? activeStyle : ""
          }`}
        >
          <Package
            className={`w-6 h-10 transition-all duration-200
            ${!open ? "mx-auto group-hover:scale-110" : "group-hover:scale-110"}`}
          />
          {open && <span>Products</span>}
        </li>

        {/* Settings */}
        <li
          onClick={() => HandleRedirect("settings")}
          className={`${itemBase} ${
            active === "settings" ? activeStyle : ""
          }`}
        >
          <Settings
            className={`w-6 h-10 transition-all duration-200
            ${!open ? "mx-auto group-hover:scale-110" : "group-hover:scale-110"}`}
          />
          {open && <span>Settings</span>}
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
