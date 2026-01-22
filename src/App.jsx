import React from "react";
import "./App.css";
// import Navbar from "./user/components/Navbar.jsx";
// import Footer from "./user/components/Footer.js";

import { Route, Routes } from "react-router-dom";

import HomePage from "./user/pages/home/HomePage.jsx";
import Signup from "./user/pages/auth/SignUp.jsx";
import Login from "./user/pages/auth/Login.jsx";
import VerifyOTP from "./user/pages/auth/VerifyOTP.jsx";
import ProtectedRoutes from "./ProtectRoute/ProtectedRoutes.jsx";
import PreventGoBack from "./ProtectRoute/PreventGoBack.jsx";
import ForgetPassword from "./user/pages/auth/ForgetPassword.jsx";
import ProductDetails from "./user/pages/home/ProductDetails.jsx";
import ProtectedAdmin from "./ProtectRoute/ProtectedAdmin.jsx";
import ProtectedUser from "./route/UserLayout.jsx";
import UserLayout from "./route/UserLayout.jsx";
import AdminLayout from "./route/AdminLayout.jsx";
import Dashboard from "./admin/pages/dashboard.jsx";
import Products from "./admin/pages/products.jsx";



function App() {

  return (
    <Routes>
      {/* ================= USER PANEL ================= */}
      <Route element={<UserLayout />}>
        <Route element={<ProtectedRoutes />}>
          {/* userProtected */}
        </Route>


        {/* genaral */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route element={<PreventGoBack />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyOtp" element={<VerifyOTP />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
        </Route>
      </Route>

      {/* ================= ADMIN PANEL ================= */}
      <Route element={<ProtectedAdmin />}>
      
        <Route element={<AdminLayout />}>
          <Route path="/admin/category" element={<div>Category</div>} />
          <Route path="/admin/dashboard" element={Dashboard} />
          <Route path="/admin/product" element={<Products/> } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
