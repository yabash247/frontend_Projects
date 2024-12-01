import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { backendURL } from '../../utils/Constant'; 


// Define the interface for StaffMember
export interface StaffMember {
  id: number;
  //user: { id: number; username: string };
  user: number;
  company: number;
  farm: number;
  position: string;
  status: string;
  level: number;
  assigned_at: string;
  created_by: { id: number; username: string };
}

// Define the slice state
interface StaffMemberState {
  staffMembers: StaffMember[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StaffMemberState = {
  staffMembers: [],
  loading: false,
  error: null,
};

// Async thunk to fetch staff members
export const fetchStaffMembers = createAsyncThunk(
  'staffMember/fetchStaffMembers',
  async (
    {
      appName,
      companyId,
      farmId,
      userId,
    }: { appName: string; companyId: number; farmId: number; userId?: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken; // Replace `auth` with your actual slice for authentication

    if (!accessToken) {
      return rejectWithValue('Access token is missing.');
    }

    let url = `${backendURL}/api/${appName}/branch/staff-members/?company=${companyId}&farm=${farmId}`;
    if (userId) {
      url += `&user=${userId}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Ensure response data is always an array
      const data = Array.isArray(response.data) ? response.data : [response.data];
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch staff members.');
    }
  }
);

// Create slice
const staffMemberSlice = createSlice({
  name: 'staffMember',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.staffMembers = action.payload;
      })
      .addCase(fetchStaffMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectStaffMembers = (state: RootState) => state.staffMember.staffMembers;
export const selectStaffMemberLoading = (state: RootState) => state.staffMember.loading;
export const selectStaffMemberError = (state: RootState) => state.staffMember.error;

export default staffMemberSlice.reducer;
