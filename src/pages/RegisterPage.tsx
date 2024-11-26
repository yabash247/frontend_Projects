import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { registerUser, clearError, resetState } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      {success && <p className="success-message">Registration successful! Please log in.</p>}
      {error && (
        <p className="error-message">
          {error} <button onClick={handleClearError}>Clear</button>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
