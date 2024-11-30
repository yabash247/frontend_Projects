import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backendURL } from '../../utils/Constant';

// Define the associated data type
interface AssociatedData {
  id: number;
  name: string;
  status: string;
  created_at: string;
}


interface Branch {
  id: number;
  name: string;
  branch_id: number;
  status: string;
  appName: string;
  modelName: string;
  created_at: string;
  associated_data: AssociatedData | null;
}

interface BranchState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  loading: false,
  error: null,
};

// Async thunk to fetch branches
export const fetchBranches = createAsyncThunk<
  Branch[],
  { accessToken: string; company: number },
  { rejectValue: string }
>("branches/fetchBranches", async ({ accessToken, company }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${backendURL}/api/company/branches/?company=${company}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // Assuming the API returns an array of branches
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || "Failed to fetch branches");
  }
});

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearError } = branchSlice.actions;
export default branchSlice.reducer;


