import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store";
import { backendURL } from "../../../utils/Constant";

// Define the types for farm and associated company
interface Company {
  id: number;
  name: string;
  address: string; // Add other fields as needed
}

interface Farm {
  id: number;
  name: string;
  description: string;
  profile_image: string;
  background_image: string;
  established_date: string;
  status: string;
  associated_company: Company; // Add associated company
  appName: string; // Add appName here
}

interface FarmState {
  farm: Farm | null;
  loading: boolean;
  error: string | null;
}

const initialState: FarmState = {
  farm: null,
  loading: false,
  error: null,
};

// Async thunk to fetch farm details
export const fetchFarmDetails = createAsyncThunk<
  Farm,
  { companyId: number; farmId: number; appName: string },
  { state: RootState; rejectValue: string }
>(
  "farm/fetchFarmDetails",
  async ({ companyId, farmId, appName }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (!accessToken) {
      return rejectWithValue("Access token is missing");
    }

    try {
      const response = await axios.get(
        `${backendURL}/api/${appName}/branch/?company=${companyId}&farm=${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            company: companyId,
            farm: farmId,
            app_name: appName,
          },
        }
      );
      return { ...response.data, appName }; // Ensure appName is included in the payload
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch farm details"
      );
    }
  }
);

// Farm slice
const farmSlice = createSlice({
  name: "farm",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.farm = action.payload;
      })
      .addCase(fetchFarmDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearError } = farmSlice.actions;
export default farmSlice.reducer;
