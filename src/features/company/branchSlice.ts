import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";
import { backendURL } from "../../utils/Constant"; // Adjust import path as needed

interface BranchState {
  branches: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  loading: false,
  error: null,
};

// Async Thunk to fetch branches
export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async ({ accessToken, company }: { accessToken: string; company: number }) => {
    const response = await axios.get(`${backendURL}/api/company/branches/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { company, app_name: "bsf" }, // Include app_name in request
    });
    return response.data;
  }
);

// Slice
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
        state.error = action.error.message || "Failed to fetch branches.";
      });
  },
});

// Selectors
export const selectBranches = (state: RootState) => state.branches.branches;
export const selectBranchesLoading = (state: RootState) => state.branches.loading;
export const selectBranchesError = (state: RootState) => state.branches.error;

export const { clearError } = branchSlice.actions;

export default branchSlice.reducer;
