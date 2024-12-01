import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from '../../../store';
import { backendURL } from '../../../utils/Constant'

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
  { accessToken: string; companyId: number; farmId: number; appName: string },
  { rejectValue: string }
>(
  
  "farm/fetchFarmDetails",
  async ({ accessToken, companyId, farmId, appName }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/${appName}/branch/?company=${companyId}&farm=${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return { ...response.data, appName }; // Assuming API returns farm details with associated company
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

