import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

const PrivateRoute: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If not logged in, navigate to the login page with the `from` location
  return accessToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
