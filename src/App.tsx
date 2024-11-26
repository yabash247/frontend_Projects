// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import StaffPage from './pages/StaffPage';
import AuthorityPage from './pages/AuthorityPage';
import StaffLevelPage from './pages/StaffLevelPage';
import LoginPage from './pages/LoginPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/companies" element={<CompanyPage />} />
      <Route path="/staff/:companyId" element={<StaffPage />} />
      <Route path="/authorities" element={<AuthorityPage />} />
      <Route path="/staff-levels" element={<StaffLevelPage />} />
    </Routes>
  </Router>
);

export default App;
