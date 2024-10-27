// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, getUserRole } = useAuth();

  return isAuthenticated() && (!requiredRole || requiredRole === getUserRole()) ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
