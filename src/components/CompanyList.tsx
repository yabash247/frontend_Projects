// src/components/CompanyList.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { getCompanies } from '../features/company/companySlice';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { Link } from "react-router-dom";

const CompanyList = () => {
  const dispatch = useAppDispatch();
  const { companies, loading, error } = useAppSelector((state) => state.company);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id}>
            <TableCell>
            <Link to={`/company/${company.id}`}>{company.name}</Link>
            </TableCell>
            <TableCell>{company.description}</TableCell>
            <TableCell>
              <Button>Edit</Button>
              <Button color="error">Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CompanyList;
