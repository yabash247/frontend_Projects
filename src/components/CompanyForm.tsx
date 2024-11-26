// src/components/CompanyForm.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { addCompany } from '../api/companyApi';
import { TextField, Button } from '@mui/material';
import { getCompanies } from '../features/company/companySlice';


const CompanyForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCompany({ name, description });
    onClose();
    dispatch(getCompanies());
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default CompanyForm;
