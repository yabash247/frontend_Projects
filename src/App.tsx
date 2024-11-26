// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import CompanyView from "./components/CompanyView";
import StaffPage from './pages/StaffPage';
import AuthorityPage from './pages/Authority/AuthorityPage';
import StaffLevelPage from './pages/StaffLevelPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./components/Navbar";

const App = () => (
  <Router>
    <Navbar />
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Private Routes */}
      <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/company/:id" element={<CompanyView />} />
          <Route path="/staff/:companyId" element={<StaffPage />} />
          <Route path="/authorities" element={<AuthorityPage />} />
          <Route path="/staff-levels" element={<StaffLevelPage />} />

          

      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      
    </Routes>
  </Router>
);

export default App;
