import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import axios from 'axios';
import { backendURL } from '../../utils/Constant';

// Existing Pond Interface
interface Pond {
    id: number;
    pond_name: string;
    pond_type: string;
    pond_use: string;
    width: string;
    length: string;
    depth: string;
    shape: string;
    status: string;
    comments: string;
    created_date: string;
    farm: number;
    company: number;
    created_by: number;
}

// New Interfaces for Pond Use Stats
interface PondUseStats {
    id: number;
    start_date: string;
    start_weight: string;
    harvest_date: string | null;
    harvest_weight: string | null;
    harvest_stage: string;
    pond_name: string;
    created_date: string;
    status: string;
    comments: string;
    created_by: number;
    approver_id: number;
    batch: number;
    pond: number;
    farm: number;
    company: number;
}

interface Media {
    id: number;
    app_name: string;
    model_name: string;
    model_id: number;
    title: string;
    category: string | null;
    file: string;
    status: string;
    created_date: string;
    negative_flags_count: number;
    comments: string;
    company: number;
    branch: number;
    uploaded_by: number;
}

interface PondData {
    pond: Pond;
    associated_media: Media[];
}

interface PondUseStatsData {
    pondusestats: PondUseStats;
    associated_media: Media[];
}

// State Interfaces
interface BsfPondsState {
    data: PondData[]; // For existing ponds
    useStatsData: PondUseStatsData[]; // For Pond Use Stats
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BsfPondsState = {
    data: [],
    useStatsData: [],
    status: 'idle',
    error: null,
};

// Thunk for fetching existing ponds
export const fetchBsfPonds = createAsyncThunk<
    PondData[], // Thunk resolves with this type.
    { id?: number; farm: number; company: number }, // Arguments to the thunk.
    { state: RootState }
>(
    'bsfPonds/fetchBsfPonds',
    async ({ id, farm, company }, { getState, rejectWithValue }) => {
        const accessToken = getState().auth.accessToken;
        if (!accessToken) {
            return rejectWithValue('Access token is missing');
        }

        try {
            const baseURL = id
                ? `${backendURL}/api/${id}/bsf/ponds/`
                : `${backendURL}/api/bsf/ponds/`;
            const params = { farm, company };

            const response = await axios.get(baseURL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params,
            });
            return response.data as PondData[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// New Thunk for fetching pond use stats
export const fetchBsfPondsUseStats = createAsyncThunk<
    PondUseStatsData[],
    { id?: number; company: number; farm: number; batch?: number; harvest_stage?: string;  },
    { state: RootState }
>(
    'bsfPonds/fetchBsfPondsUseStats',
    async ({ id, company, farm, batch, harvest_stage }, { getState, rejectWithValue }) => {
        const accessToken = getState().auth.accessToken;
        if (!accessToken) {
            return rejectWithValue('Access token is missing');
        }

        try {
            const baseURL = id
                ? `${backendURL}/api/bsf/ponduse-stats/${id}/`
                : `${backendURL}/api/bsf/ponduse-stats/`;
            const params = { company, farm, batch, harvest_stage };
            
            
            const response = await axios.get(baseURL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params,
            });

            //console.log('data', response.data);
            return response.data as PondUseStatsData[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const bsfPondsSlice = createSlice({
    name: 'bsfPonds',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch existing ponds
        builder
            .addCase(fetchBsfPonds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBsfPonds.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchBsfPonds.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch pond use stats
        builder
            .addCase(fetchBsfPondsUseStats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBsfPondsUseStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.useStatsData = action.payload;
            })
            .addCase(fetchBsfPondsUseStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default bsfPondsSlice.reducer;

// Selectors
export const selectBsfPonds = (state: RootState) => state.bsfPonds.data;
export const selectBsfPondsStatus = (state: RootState) => state.bsfPonds.status;
export const selectBsfPondsError = (state: RootState) => state.bsfPonds.error;

export const selectBsfPondsUseStats = (state: RootState) => state.bsfPonds.useStatsData;
export const selectBsfPondsUseStatsStatus = (state: RootState) => state.bsfPonds.status;
export const selectBsfPondsUseStatsError = (state: RootState) => state.bsfPonds.error;
