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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch NetUseStats.');
    }
  }
);

// Async Thunk for creating NetUseStats
export const netUseCreate = createAsyncThunk(
  'netUseStats/netUseCreate',
  async (
    {
      companyId,
      farmId,
      batchId,
      netId,
      layStart,
      stats,
      media,
    }: {
      companyId: number;
      farmId: number;
      batchId: number;
      netId: number;
      layStart: string;
      stats: string;
      media: { title: string; file: File; comments?: string }[];
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      const formData = new FormData();
      formData.append('company', companyId.toString());
      formData.append('farm', farmId.toString());
      formData.append('batch', batchId.toString());
      formData.append('net', netId.toString());
      formData.append('lay_start', layStart);
      formData.append('stats', stats);

      // Ensure files are added properly
      media.forEach((item, index) => {
        formData.append(`media[${index}][title]`, item.title);
        formData.append(`media[${index}][file]`, item.file); // Properly append file
        if (item.comments) {
          formData.append(`media[${index}][comments]`, item.comments);
        }
      });

      console.log('Media being added to formData:', media);
      console.log('Payload being sent:', formData);
      const response = await axios.post(`${backendURL}/api/bsf/net-use-stats/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // Ensure correct encoding
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to create NetUseStats.');
    }
  }
);


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
      })
      .addCase(netUseCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(netUseCreate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(netUseCreate.rejected, (state, action) => {
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
