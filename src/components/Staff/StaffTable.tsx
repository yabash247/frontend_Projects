

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchAllCompanyStaff } from '../../features/staff/staffSlice';
//import { fetchStaffLevels } from '../../features/staff/staffLevelSlice';
import { fetchUserById, selectUserById } from '../../features/user/userSlice';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

interface StaffTableProps {
  companyId: number;
}

const StaffTable: React.FC<StaffTableProps> = ({ companyId }) => {
  const dispatch = useAppDispatch();
  const { staffList, loading, error } = useAppSelector((state) => state.staff);
  const users = useAppSelector((state) => state.user.users);
  const staffLevels = useAppSelector((state) => state.staffLevel.staffLevels);

  useEffect(() => {
    dispatch(fetchAllCompanyStaff(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    staffList.forEach((staff) => {
      if (!users[staff.user]) {
        dispatch(fetchUserById(staff.user));
      }
      //dispatch(fetchStaffLevels({ userId: staff.user, companyId }));
    });
  }, [dispatch, staffList, users, companyId]);
  console.log(staffLevels);
  

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Co.Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staffList.map((staff) => {
            const user = users[staff.user];
            return (
              <TableRow key={staff.id}>
                <TableCell> <Link to={`/staff/edit/${staff.id}/${companyId}`}>{user ? user.username : 'Loading...'}</Link></TableCell>
                <TableCell>{staff.work_phone}</TableCell>
                <TableCell>{user ? user.email : 'Loading...'}</TableCell>
                <TableCell>{user ? user.username : 'Loading...'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StaffTable;
