// src/features/staff/staffSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendURL } from "../../utils/Constant";
import { RootState } from '../../store'; 

interface StaffState {
  staffLevels: any;
  staffList: any[];
  staffDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staffLevels: [],
  staffList: [],
  staffDetails: null,
  loading: false,
  error: null,
};

// Fetch staff list by company

// Async thunk to fetch staff with access token
export const fetchAllCompanyStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (companyId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const accessToken = state.auth.accessToken; // Assuming auth slice stores the token

      // Make API request with the token in headers
      const response = await axios.get(`${backendURL}/api/company/${companyId}/staff/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add token here
        },
      });

      return response.data; // Return the data for the fulfilled case
    } catch (error) {
      // Check if error is an AxiosError or has a response
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || { message: 'Server error' });
      }
      // For other types of errors, provide a fallback
      return rejectWithValue({ message: (error as Error).message || 'Something went wrong' });
    }
  }
);

/*
export const fetchAllCompanyStaff = createAsyncThunk('staff/fetchStaff', async (companyId: number) => {

  const response = await axios.get(`${backendURL}/api/company/${companyId}/staff/`);
  return response.data;

});
*/

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanyStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCompanyStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload;
      })
      .addCase(fetchAllCompanyStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load staff data';
      });
  },
});

export default staffSlice.reducer;
