import React from "react";
import { Navigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";  
import { jwtDecode } from "jwt-decode";  // ✅


const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (role && decoded.role !== role) {
      // If role is passed and user's role doesn't match
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (error) {
    console.error("Invalid Token", error);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;

