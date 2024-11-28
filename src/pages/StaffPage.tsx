// src/pages/StaffPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StaffTable from '../components/Staff/StaffTable';

const StaffPage = () => {

  const { companyId } = useParams<{ companyId: string }>();
  
  
  if (!companyId) {
    return <p>Invalid company ID</p>;
  }

  return (
    <div>
      <h2>Staff Management</h2>
      <StaffTable companyId={parseInt(companyId, 10)} />
    </div>
  );
};

export default StaffPage;
