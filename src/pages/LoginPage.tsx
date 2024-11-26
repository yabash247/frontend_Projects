// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loginUser, clearError } from '../features/auth/authSlice';
import '../styles/LoginPage.css'
//import axios from 'axios';



const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, accessToken  } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  // Get the `from` location from state or default to `/dashboard`
  const from = (location.state as { from: { pathname: string } })?.from?.pathname || "/dashboard";


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Redirect after successful login
  // Redirect after successful login
  useEffect(() => {
    if (accessToken ) {
      // If the previous location was the login page, redirect to the dashboard
      if (from === "/login") {
        navigate("/dashboard");
      } else {
        navigate(from);
      }
    }
  }, [accessToken , navigate, from]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && (
        <p className="error-message">
          {error} <button onClick={() => dispatch(clearError())}>Clear</button>
        </p>
      )}
      <form onSubmit={handleSubmit}>
      <label className="login-label">Email</label>
            <input
            className="login-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="login-label">Password</label>
            <input
            className="login-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      </div>

    </div>

    
  );
};

export default LoginPage;