

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store"; // Adjust based on your file structure
import { backendURL } from "../../utils/Constant"; // Adjust based on your file structure

// Define the structure of the duration settings
interface DurationSetting {
  id: number;
  laying_duration: number;
  nursery_duration: number;
  incubation_duration: number;
  growout_duration: number;
  puppa_in_net_replenishment_duration: number;
  feed1_fermentation_period: number;
  feed2_fermentation_period: number;
  attractant_duration: number;
  general_inspection_duration: number;
  net_cleanup_duration: number;
  company: number;
  farm: number;
}

// Define the slice state structure
interface DurationSettingsState {
  data: DurationSetting[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DurationSettingsState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch duration settings
export const fetchDurationSettings = createAsyncThunk<
  DurationSetting[],
  { company: number; farm: number },
  { state: RootState; rejectValue: string }
>(
  "durationSettings/fetchDurationSettings",
  async ({ company, farm }, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth;

    if (!accessToken) {
      return rejectWithValue("Access token is missing.");
    }

    try {
      const response = await axios.get<DurationSetting[]>(
        `${backendURL}/api/bsf/duration-settings/`,
        {
          params: { company, farm },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //console.log("API Response:", response.data); // Log API response
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data); // Log API error
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch duration settings."
      );
    }
  }
);


// Slice definition
const durationSettingsSlice = createSlice({
  name: "durationSettings",
  initialState,
  reducers: {
    resetDurationSettingsState(state) {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDurationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(
        fetchDurationSettings.fulfilled,
        (state, action: PayloadAction<DurationSetting[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(
        fetchDurationSettings.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong.";
          
        }
      );
  },
});

// Export actions and reducer
export const { resetDurationSettingsState } = durationSettingsSlice.actions;
export default durationSettingsSlice.reducer;
