import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    console.warn("ProtectedRoute: User is not authenticated. Redirecting to /login.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
