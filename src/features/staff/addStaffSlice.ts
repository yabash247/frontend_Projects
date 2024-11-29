import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendURL } from "../../utils/Constant"
import { RootState } from '../../store';
import { Dayjs } from 'dayjs';

interface AddStaffState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: AddStaffState = {
    loading: false,
    success: false,
    error: null,
};

// Async thunk to add a new staff member
export const addStaff = createAsyncThunk<
    void,
    { user: number; company: number; work_email: string; work_phone: string; joined_company_date: Dayjs | null; comments: string; },
    { rejectValue: string }
>(
    `staff/addStaff`,
    async ({ user, company, work_email, work_phone, joined_company_date, comments }, { getState, rejectWithValue }) => {
        try {
            console.log("joined_company_date", joined_company_date);

            const state = getState() as RootState;
            const accessToken = state.auth.accessToken;

            const response = await axios.post(
                `${backendURL}/api/company/staff/add/`,
                {
                    user,
                    company,
                    work_email,
                    work_phone,
                    joined_company_date,
                    comments,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status !== 201) {
                throw new Error('Failed to add staff member.');
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || 'Failed to add staff member.'
            );
        }
    }
);

const addStaffSlice = createSlice({
    name: 'addStaff',
    initialState,
    reducers: {
        resetAddStaffState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addStaff.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(addStaff.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong.';
            });
    },
});

export const { resetAddStaffState } = addStaffSlice.actions;
export default addStaffSlice.reducer;
