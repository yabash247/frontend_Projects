import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchStaffMembers,
  selectStaffMembers,
  selectStaffMemberLoading,
  selectStaffMemberError,
} from '../../features/company/staffMemberSlice';
import { RootState } from '../../store';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';

const StaffMemberList: React.FC = () => {
  const { appName, companyId, farmId, userId } = useParams<{
    appName: string;
    companyId: string;
    farmId: string;
    userId?: string;
  }>();
  const dispatch = useDispatch();
  const staffMembers = useSelector((state: RootState) => state.staffMember.staffMembers);
  const loading = useSelector((state: RootState) => state.staffMember.loading);
  const error = useSelector((state: RootState) => state.staffMember.error);

  useEffect(() => {
    if (appName && companyId && farmId) {
      dispatch(
        fetchStaffMembers({
          appName,
          companyId: parseInt(companyId, 10),
          farmId: parseInt(farmId, 10),
          userId: userId ? parseInt(userId, 10) : undefined,
        }) as any
      );
    }
  }, [dispatch, appName, companyId, farmId, userId]);

  // Ensure staffMembers is an array before mapping
  if (!Array.isArray(staffMembers)) {
    return <Typography variant="body1" align="center">Invalid staff members data.</Typography>;
  }
  

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="center" gutterBottom>
        Staff Members for {appName}
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && staffMembers.length === 0 && (
        <Typography variant="body1" align="center">
          No staff members found.
        </Typography>
      )}
      {!loading && !error && staffMembers.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Assigned At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.user}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.status}</TableCell>
                <TableCell>{staff.level}</TableCell>
                <TableCell>{new Date(staff.assigned_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default StaffMemberList;
