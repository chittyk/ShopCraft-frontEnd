import React from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage.jsx";
import Signup from "./pages/auth/SignUp.jsx";
import Login from "./pages/auth/Login.jsx";
import VerifyOTP from "./pages/auth/VerifyOTP.jsx";
import ProtectedRoutes from "./components/ProtectRoute/ProtectedRoutes.jsx";
import PreventGoBack from "./components/ProtectRoute/PreventGoBack.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import ProductDetails from "./pages/home/ProductDetails.jsx";

function App() {
  return (
    <div className="bg-gray-900 flex flex-col text-white min-h-screen">
      <Navbar />
      <main className="flex flex-row justify-center py-20">
        <div className="hidden md:block w-[15%] h-10"></div>

        <div className="flex-1">
          <Routes>
            {/*  Protected Routes */}
            {/* <Route element={<ProtectedRoutes />}> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            {/* </Route> */}

            {/* Prevent Go Back Routes */}
            <Route element={<PreventGoBack />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verifyOtp" element={<VerifyOTP />} />
              <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            </Route>
            
            
          </Routes>
        </div>

        <div className="hidden md:block w-[15%] h-10"></div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
