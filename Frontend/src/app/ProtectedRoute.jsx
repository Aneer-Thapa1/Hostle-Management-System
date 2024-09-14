import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.includes(user.role)) {
    // User has the correct role, render the children
    return children;
  } else if (user.role === "hostelOwner") {
    // Hostel owner trying to access user route, redirect to admin page
    return <Navigate to="/admin" replace />;
  } else {
    // User doesn't have the correct role, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;
