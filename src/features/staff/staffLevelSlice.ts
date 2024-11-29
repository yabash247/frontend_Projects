import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendURL } from "../../utils/Constant"
import { RootState } from '../../store';

interface StaffLevel {
  id: number;
  user: number;
  company: number;
  level: string;
}

interface StaffLevelState {
  staffLevels: StaffLevel | null;
  loadings: boolean;
  errors: string | null;
}

// Initial state
const initialState: StaffLevelState = {
  staffLevels: null,
  loadings: false,
  errors: null,
};

// Async thunk for fetching staff levels
export const fetchStaffLevel = createAsyncThunk<
  StaffLevel, // The type of the returned data
  { companyId: number; userId: number}, // The input arguments
  { rejectValue: string } // The type of the rejected error message
>(
  'staffLevel/fetchStaffLevel',
  async ({ companyId, userId }, {getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const accessToken = state.auth.accessToken;
      const response = await axios.get<StaffLevel>(
        `${backendURL}/api/company/staff/stafflevels/${companyId}/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch staff levels.'
      );
    }
  }
);

// Redux slice
const staffLevelSlice = createSlice({
  name: 'staffLevel',
  initialState,
  reducers: {
    clearStaffLevel: (state) => {
      state.staffLevels = null;
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffLevel.pending, (state) => {
        state.loadings = true;
        state.errors = null;
      })
      .addCase(fetchStaffLevel.fulfilled, (state, action) => {
        state.loadings = false;
        state.staffLevels = action.payload;
      })
      .addCase(fetchStaffLevel.rejected, (state, action) => {
        state.loadings = false;
        state.errors = action.payload || 'Something went wrong.';
      });
  },
});

export const { clearStaffLevel } = staffLevelSlice.actions;
export default staffLevelSlice.reducer;
