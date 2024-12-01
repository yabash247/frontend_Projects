// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams  } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import CompanyView from "./components/CompanyView";
import StaffPage from './pages/StaffPage';
import AuthorityPage from './pages/Authority/AuthorityManagement';
import StaffLevelPage from './pages/StaffLevelPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./components/PrivateRoute";
import StaffLevelComponent from './components/Staff/StaffLevelComponent';
import BranchList from './components/Company/BranchList';
import StaffMemberList from './components/Company/StaffMemberList';
import FarmDetail from "./components/Company/BSF/FarmDetail";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Navbar from "./components/Navbar";

const App = () => (
<LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <Route path="/company/branches/:companyId" element={<BranchListWithToken />} />
          <Route path="/company/branch/bsf/:companyId/:farmId/:appName" element={<FarmDetailWithParams />} />
          <Route path="/staff-members/:appName/:companyId/:farmId/:userId?" element={<StaffMemberList />}/>
          <Route path="/company/:id" element={<CompanyView />} />
          <Route path="/staff/:companyId" element={<StaffPage />} />
          <Route path="/authorities/:companyId" element={<AuthorityPage />} />
          <Route path="/staff-levels" element={<StaffLevelPage />} />
          <Route path="/staff/levels/:companyId/:userId" element={<StaffLevelComponent />} />



        </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  </Router></LocalizationProvider>
);

const BranchListWithToken: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();

  if (!companyId) {
    return <p>Invalid company ID.</p>;
  }

  return <BranchList company={parseInt(companyId, 10)} />;
};


// Wrapper for dynamic route parameters
const FarmDetailWithParams: React.FC = () => {
  const { companyId, farmId, appName } = useParams<{ companyId: string; farmId: string; appName: string }>();
  
  if (!companyId) {
    return <p>Invalid company ID.</p>;
  }else if (!farmId) {
    return <p>Invalid farm ID.</p>;
  }
  return <FarmDetail companyId={parseInt(companyId, 10)} farmId={parseInt(farmId, 10)} appName={appName || ''}/>

  
};


export default App;
