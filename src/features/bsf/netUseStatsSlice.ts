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
    {
      companyId,
      farmId,
      batchId,
      id,
    }: { companyId: number; farmId: number; batchId: number; id?: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      // Build the query parameters dynamically
      let url = `${backendURL}/api/bsf/net-use-stats/retrieve-all/?company=${companyId}&farm=${farmId}&batch=${batchId}`;
      if (id !== undefined) {
        url += `&id=${id}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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

      // Flatten the media array into individual keys for compatibility with Django backend
      media.forEach((item, index) => {
        formData.append(`media_title_${index}`, item.title);
        formData.append(`media_file_${index}`, item.file);
        if (item.comments) {
          formData.append(`media_comments_${index}`, item.comments);
        }
      });

      // Debugging: Uncomment to log formData keys and values
      // for (const pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }

      const response = await axios.post(`${backendURL}/api/bsf/net-use-stats/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create NetUseStats.');
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
