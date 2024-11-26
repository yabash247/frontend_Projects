// src/features/company/companySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCompanies, addCompany, editCompany, deleteCompany } from '../../api/companyApi';

interface CompanyState {
  companies: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
};

export const getCompanies = createAsyncThunk('company/getCompanies', async () => {
  return await fetchCompanies();
});

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch companies';
      });
  },
});

export default companySlice.reducer;
