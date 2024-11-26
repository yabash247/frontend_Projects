import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { logout } from "../features/auth/authSlice";

const LogoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout()); // Clear authentication state
    navigate("/login"); // Redirect to login page
  }, [dispatch, navigate]);

  return (
    <div className="logout-page">
      <p>Logging you out...</p>
    </div>
  );
};

export default LogoutPage;
