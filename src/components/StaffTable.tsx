// src/components/StaffTable.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchStaff } from '../features/staff/staffSlice';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface StaffTableProps {
  companyId: number;
}

const StaffTable: React.FC<StaffTableProps> = ({ companyId }) => {
  const dispatch = useAppDispatch();
  const { staffList, loading, error  } = useAppSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchStaff(companyId));
  }, [dispatch, companyId]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staffList.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>{staff.name}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>{staff.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StaffTable;
