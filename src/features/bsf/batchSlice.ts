import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { backendURL } from '../../utils/Constant';

// Define types
interface BatchState {
  batchList: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BatchState = {
  batchList: [],
  loading: false,
  error: null,
};

// Async Thunks

export const fetchBatch = createAsyncThunk(
  'batch/fetchBatch',
  async ({ companyId, farmId, batchId }: { companyId: number; farmId: number; batchId: number }, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    const response = await axios.get(`${backendURL}/api/bsf/batches/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        company: companyId,
        app_name: 'bsf',
        model_name: 'Batch',
        model_id: batchId,
        farm: farmId,
      },
    });
    return response.data;
  }
);

export const fetchBatchById = createAsyncThunk(
  'batch/fetchBatchById',
  async (
    { batchId, companyId, farmId }: { batchId: number; companyId: number; farmId: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      const response = await axios.get(
        `${backendURL}/api/bsf/batches/${batchId}/?company=${companyId}&farm=${farmId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch batch details');
    }
  }
);

export const uploadBatch = createAsyncThunk(
  'batch/uploadBatch',
  async (
    { companyId, branchId, batchId, files }: { companyId: number; branchId: number | null; batchId: number; files: File[] },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      const formData = new FormData();
      formData.append('company', companyId.toString());
      if (branchId) {
        formData.append('branch', branchId.toString());
      }
      formData.append('app_name', 'bsf');
      formData.append('model_name', 'Batch');
      formData.append('model_id', batchId.toString());
      files.forEach((file) => formData.append('file', file));

      const response = await axios.post(`${backendURL}/api/company/media/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteBatch = createAsyncThunk(
  'batch/deleteBatch',
  async ({ batchId }: { batchId: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      const response = await axios.delete(`${backendURL}/api/company/media/${batchId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return { batchId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice

const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batchList = action.payload;
      })
      .addCase(fetchBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch batch.';
      })
      .addCase(fetchBatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.batchList = [action.payload];
      })
      .addCase(fetchBatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch batch details.';
      })
      .addCase(uploadBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batchList.push(action.payload);
      })
      .addCase(uploadBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload batch.';
      })
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batchList = state.batchList.filter((batch) => batch.id !== action.payload.batchId);
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete batch.';
      });
  },
});

export const selectBatch = (state: RootState) => state.batch.batchList;
export const selectBatchById = (state: RootState, batchId: number) =>
  state.batch.batchList.find((batch) => batch.id === batchId);
export const selectBatchLoading = (state: RootState) => state.batch.loading;
export const selectBatchError = (state: RootState) => state.batch.error;

export default batchSlice.reducer;
