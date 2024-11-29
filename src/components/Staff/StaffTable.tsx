

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchAllCompanyStaff } from '../../features/staff/staffSlice';
import { fetchStaffLevel, clearStaffLevel } from '../../features/staff/staffLevelSlice';
import { fetchUserById, selectUserById } from '../../features/user/userSlice';
import { RootState } from '../../store';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { frontendURL } from '../../utils/Constant';
import AddStaffModal from './AddStaffModal';

interface StaffTableProps {
  companyId: number;
}

const StaffTable: React.FC<StaffTableProps> = ({ companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { staffList, loading, error } = useAppSelector((state) => state.staff);
  const users = useAppSelector((state) => state.user.users);

  // Get state from the staffLevel slice
  const { staffLevels, loadings, errors } = useAppSelector((state: RootState) => state.staffLevel);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //const staffLevels = useAppSelector((state) => state.staffLevel.staffLevels);

  useEffect(() => {
    dispatch(fetchAllCompanyStaff(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    staffList.forEach((staff) => {
      if (!users[staff.user]) {
        dispatch(fetchUserById(staff.user));
      }
      //dispatch(fetchStaffLevels({ userId: staff.user, companyId }));
      if (companyId && staff.user) {
        dispatch(fetchStaffLevel({ companyId: Number(companyId), userId: Number(staff.user) }));
      }// Cleanup on unmount
    return () => {
      dispatch(clearStaffLevel());
    };
    });
  }, [dispatch, staffList, users, companyId]);
  

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Paper>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Staff
      </Button>
      <AddStaffModal open={isModalOpen} onClose={handleCloseModal} company={companyId} />
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
            // Cleanup on unmount
            
            return (
              <TableRow key={staff.id}>
                <TableCell> <Link to={`/staff/edit/${staff.id}/${companyId}`}>{user ? user.username : 'Loading...'}</Link></TableCell>
                <TableCell>{staff.work_phone}</TableCell>
                <TableCell>{user ? user.email : 'Loading...'}</TableCell>
                <TableCell><Link to={`${frontendURL}/staff/levels/${companyId}/${user ? user.id : 0}/`}>{staffLevels ? staffLevels.level : '0'}</Link></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StaffTable;
