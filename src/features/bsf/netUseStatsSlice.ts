import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { backendURL } from '../../utils/Constant';

// Define types
interface NetUseStatsState {
  netUseStats: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: NetUseStatsState = {
  netUseStats: null,
  loading: false,
  error: null,
};

// Async Thunk for fetching NetUseStats
export const fetchNetUseStats = createAsyncThunk(
  'netUseStats/fetchNetUseStats',
  async (
    { companyId, farmId, batchId }: { companyId: number; farmId: number; batchId: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      const response = await axios.get(
        `${backendURL}/api/bsf/net-use-stats/${batchId}/?company=${companyId}&farm=${farmId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch NetUseStats.'
      );
    }
  }
);

// Slice
const netUseStatsSlice = createSlice({
  name: 'netUseStats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetUseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetUseStats.fulfilled, (state, action) => {
        state.loading = false;
        state.netUseStats = action.payload;
      })
      .addCase(fetchNetUseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = netUseStatsSlice.actions;

export const selectNetUseStats = (state: RootState) => state.netUseStats.netUseStats;
export const selectNetUseStatsLoading = (state: RootState) => state.netUseStats.loading;
export const selectNetUseStatsError = (state: RootState) => state.netUseStats.error;

export default netUseStatsSlice.reducer;
