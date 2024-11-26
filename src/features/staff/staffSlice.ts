// src/features/staff/staffSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface StaffState {
  staffList: any[];
  staffDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staffList: [],
  staffDetails: null,
  loading: false,
  error: null,
};

// Fetch staff list by company
export const fetchStaff = createAsyncThunk('staff/fetchStaff', async (companyId: number) => {
  const response = await axios.get(`/api/companies/${companyId}/staff/`);
  return response.data;
});

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load staff data';
      });
  },
});

export default staffSlice.reducer;
