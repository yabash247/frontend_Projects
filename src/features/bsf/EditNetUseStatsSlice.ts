import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store'; // Import RootState to infer types
import { backendURL } from '../../utils/Constant'; // Import backend URL

interface MediaItem {
  title: string;
  file: File | null;
  comments?: string;
}

interface EditNetUseStatsData {
  company: number;
  farm: number;
  batch: number;
  harvest_weight: number;
  lay_end: string;
  stats: string;
  media: MediaItem[];
}

interface NetUseStatsState {
  netUseStats: EditNetUseStatsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: NetUseStatsState = {
  netUseStats: null,
  loading: false,
  error: null,
};

export const updateNetUseStats = createAsyncThunk<
  EditNetUseStatsData, // Return type
  { id: number; data: EditNetUseStatsData }, // Arguments
  { state: RootState } // Thunk API config
>(
  'netUseStats/updateNetUseStats',
  async ({ id, data }, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth; // Ensure `auth` slice exists in the root state
    const url = `${backendURL}/api/bsf/net-use-stats/${id}/`;

    try {
      const formData = new FormData();
      formData.append('company', data.company.toString());
      formData.append('farm', data.farm.toString());
      formData.append('batch', data.batch.toString());
      formData.append('harvest_weight', data.harvest_weight.toString());
      formData.append('lay_end', data.lay_end);
      formData.append('stats', data.stats);

      data.media.forEach((item, index) => {
        formData.append(`media_title_${index}`, item.title);
        formData.append(`media_file_${index}`, item.file as File);
        if (item.comments) {
          formData.append(`media_comments_${index}`, item.comments);
        }
      });

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error occurred');
    }
  }
);

const netUseStatsSlice = createSlice({
  name: 'netUseStats',
  initialState,
  reducers: {
    clearNetUseStats: (state) => {
      state.netUseStats = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateNetUseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNetUseStats.fulfilled, (state, action: PayloadAction<EditNetUseStatsData>) => {
        state.loading = false;
        state.netUseStats = action.payload;
      })
      .addCase(updateNetUseStats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNetUseStats } = netUseStatsSlice.actions;
export default netUseStatsSlice.reducer;
