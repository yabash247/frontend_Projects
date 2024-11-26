// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import StaffPage from './pages/StaffPage';
import AuthorityPage from './pages/AuthorityPage';
import StaffLevelPage from './pages/StaffLevelPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <Router>
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private Routes */}
      <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/staff/:companyId" element={<StaffPage />} />
          <Route path="/authorities" element={<AuthorityPage />} />
          <Route path="/staff-levels" element={<StaffLevelPage />} />
      </Route>
      
    </Routes>
  </Router>
);

export default App;
