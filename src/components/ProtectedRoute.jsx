import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) { // CHANGED: Handle error state
    console.log("Access denied: Authentication error", error);
    return <Navigate to="/error" replace />;
  }
  
  if (!user) {
    console.log("Access denied: User not authenticated");
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    console.log("Access denied: Missing user role");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    console.log(`Access denied: User role '${role}' not in allowed roles: ${allowedRoles}`);
    // CHANGED: Log the current path for debugging
    console.log(`Redirecting to /unauthorized for user with role '${role}' attempting to access ${window.location.pathname}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // CHANGED: Log successful access for debugging
  console.log(`Access granted: User role '${role}' is allowed for ${window.location.pathname}`);
  return children;
};

export default ProtectedRoute;