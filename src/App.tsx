import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import CompanyView from './components/CompanyView';
import StaffPage from './pages/StaffPage';
import AuthorityPage from './pages/Authority/AuthorityManagement';
import StaffLevelPage from './pages/StaffLevelPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './components/PrivateRoute';
import StaffLevelComponent from './components/Staff/StaffLevelComponent';
import BranchList from './components/Company/BranchList';
import StaffMemberList from './components/Company/StaffMemberList';
import FarmDetail from './components/Company/BSF/FarmDetail';
import BatchTable from './components/Bsf/BatchTable'; // Updated BatchTable import
import BatchUpload from './components/Bsf/BatchUpload';
import BatchDetailsModal from './components/Bsf/BatchDetailsModal';
//import NetUseCreateForm from './features/bsf/NetUseStatsForm';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Navbar from './components/Navbar';

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
          <Route path="/staff-members/:appName/:companyId/:farmId/:userId?" element={<StaffMemberList />} />
          <Route path="/company/:id" element={<CompanyView />} />
          <Route path="/staff/:companyId" element={<StaffPage />} />
          <Route path="/authorities/:companyId" element={<AuthorityPage />} />
          <Route path="/staff-levels" element={<StaffLevelPage />} />
          <Route path="/staff/levels/:companyId/:userId" element={<StaffLevelComponent />} />

          {/* Batch Routes */}
          <Route path="/batch/:companyId/:farmId/list" element={<BatchTableWithParams />} />
          <Route path="/batch/:companyId/:farmId/upload" element={<BatchUploadWithParams />} />
         {/*  <Route
            path="/batch/:companyId/:farmId/:batchId/create-net-use"
            element={<NetUseCreateForm companyId={5} farmId={2} batchId={3} />}
          />*/}
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  </LocalizationProvider>
);

const BranchListWithToken: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();

  if (!companyId) {
    return <p>Invalid company ID.</p>;
  }

  return <BranchList company={parseInt(companyId, 10)} />;
};

// Wrapper for dynamic route parameters for FarmDetail
const FarmDetailWithParams: React.FC = () => {
  const { companyId, farmId, appName } = useParams<{ companyId: string; farmId: string; appName: string }>();

  if (!companyId || !farmId) {
    return <p>Invalid parameters.</p>;
  }

  return <FarmDetail companyId={parseInt(companyId, 10)} farmId={parseInt(farmId, 10)} appName={appName || ''} />;
};

// Wrapper for dynamic route parameters for BatchTable
const BatchTableWithParams: React.FC = () => {
  const { companyId, farmId } = useParams<{ companyId: string; farmId: string }>();

  if (!companyId || !farmId) {
    return <p>Invalid parameters.</p>;
  }

  return <BatchTable companyId={parseInt(companyId, 10)} farmId={parseInt(farmId, 10)} />;
};

// Wrapper for dynamic route parameters for BatchUpload
const BatchUploadWithParams: React.FC = () => {
  const { companyId, farmId } = useParams<{ companyId: string; farmId: string }>();

  if (!companyId || !farmId) {
    return <p>Invalid parameters.</p>;
  }

  return <BatchUpload companyId={parseInt(companyId, 10)} branchId={null} batchId={0} />;
};

export default App;
