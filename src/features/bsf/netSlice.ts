import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { backendURL } from '../../utils/Constant';

interface Net {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  status: string;
  farm: string;
  company: string;
}

interface NetState {
  nets: Net[];
  loading: boolean;
  error: string | null;
}

const initialState: NetState = {
  nets: [],
  loading: false,
  error: null,
};

// Thunk to get all nets for a specific farm and company
export const getAllFarmNets = createAsyncThunk(
  'nets/getAllFarmNets',
  async (
    { companyId, farmId }: { companyId: number; farmId: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    try {
      const response = await axios.get(`${backendURL}/api/bsf/nets_statsCheck/?company=${companyId}&farm=${farmId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          company: companyId,
          farm: farmId,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch nets.');
    }
  }
);

const netSlice = createSlice({
  name: 'nets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFarmNets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFarmNets.fulfilled, (state, action) => {
        state.loading = false;
        state.nets = action.payload;
      })
      .addCase(getAllFarmNets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selector to access nets in the state
export const selectNets = (state: RootState) => state.nets.nets;
export const selectNetsLoading = (state: RootState) => state.nets.loading;
export const selectNetsError = (state: RootState) => state.nets.error;

export default netSlice.reducer;
