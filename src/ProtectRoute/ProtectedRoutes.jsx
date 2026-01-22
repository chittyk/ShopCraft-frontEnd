import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { isTokenValid } from "../utils/auth";

const ProtectedRoutes = () => {
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // ✅ renders child routes
};

export default ProtectedRoutes;
