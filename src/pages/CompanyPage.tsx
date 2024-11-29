// src/pages/CompanyPage.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CompanyList from '../components/CompanyList';
import AddCompanyForm from '../components/AddCompanyForm';
import CompanyForm from '../components/CompanyForm';

const CompanyPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Company Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleForm}
          sx={{ textTransform: 'none' }}
        >
          {isFormOpen ? 'Cancel' : 'Add New Company'}
        </Button>
      </Box>

      {/* Form Section */}
      {isFormOpen && (
        <Box sx={{ mb: 3 }}>
          <AddCompanyForm onClose={toggleForm} />
        </Box>
      )}

      {/* Company List Section */}
      <Box>
        <CompanyList />
      </Box>
    </Box>
  );
};

export default CompanyPage;
