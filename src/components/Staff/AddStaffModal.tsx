import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { addStaff, resetAddStaffState } from '../../features/staff/addStaffSlice';
import { RootState, AppDispatch } from '../../store';

import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';


interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
  company: number;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ open, onClose, company }) => {
  const dispatch = useDispatch<AppDispatch>(); // Properly typed dispatch
  const { loading, success, error } = useSelector((state: RootState) => state.addStaff);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [user, setUserId] = useState<number>(0);
  const [work_phone, setWork_phone] = useState<string>('');
  const [work_email, setWork_email] = useState<string>('');
  const [joined_company_date, setJoined_company_date] = useState<Dayjs | null>(dayjs());
  const [comments, setComments] = useState<string>('');

  const [workPhoneError, setWorkPhoneError] = useState<boolean>(false);
  
  const handleDateChange = (date: Dayjs | null) => {
    setJoined_company_date(date);
  };

  useEffect(() => {
    if (success) {
      onClose();
      dispatch(resetAddStaffState());
    }
  }, [success, onClose, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for workPhone
    if (!work_phone.trim()) {
      setWorkPhoneError(true);
      return;
    }
    setWorkPhoneError(false);

    if (accessToken) {
      dispatch(addStaff({ user, company, work_email, work_phone, joined_company_date, comments }));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Add New Staff Member
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="user"
          label="UserID Number"
          name="user"
          autoFocus
          value={user}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <TextField
          margin="normal"
          fullWidth
          id="work_email"
          label="Work Email"
          name="work_email"
          value={work_email}
          onChange={(e) => setWork_email(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          id="work_phone"
          label="Work Phone"
          name="work_phone"
          value={work_phone}
          onChange={(e) => setWork_phone(e.target.value)}
        />
        <DatePicker
          label="Joined Company Date"
          value={joined_company_date}
          onChange={handleDateChange}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <TextField
          margin="normal"
          fullWidth
          id="comments"
          label="Comments"
          name="comments"
          multiline
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Add Staff
          </Button>
        )}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default AddStaffModal;
