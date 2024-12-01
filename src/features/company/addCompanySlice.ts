// src/features/company/addCompanySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { backendURL } from '../../utils/Constant';


  // Define the associated data type
  interface AssociatedData {
    id: number;
    name: string;
    status: string;
    created_at: string;
    address: string;
  }


interface Farm {
    id: number;
    name: string;
    location: string;
    background_image: string;
    description: string;
    status: string;
    established_date: string;
    associated_company: AssociatedData | null;
  }


  
  

interface CompanyState {
    name: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    comments: string;
    status: string;
    loading: boolean;
    error: string | null;
    newCompany: any | null; // Add a new field to store the newly added company data
    farm: Farm | null;
    
}

const initialState: CompanyState = {
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    comments: '',
    status: '',
    loading: false,
    error: null,
    newCompany: null, // Initialize the new field
    farm: null,
};

// Async thunk for adding a company
export const addCompany = createAsyncThunk(
    'company/addCompany',
    async (companyData: Omit<CompanyState, 'loading' | 'error'>, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const accessToken = state.auth.accessToken; // Assuming accessToken is stored in auth slice

        try {
            const response = await axios.post(
                `${backendURL}/api/company/add/`,
                companyData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const addCompanySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setName(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setPhone(state, action: PayloadAction<string>) {
            state.phone = action.payload;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setWebsite(state, action: PayloadAction<string>) {
            state.website = action.payload;
        },
        setComments(state, action: PayloadAction<string>) {
            state.comments = action.payload;
        },
        setStatus(state, action: PayloadAction<string>) {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCompany.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.name = '';
                state.description = '';
                state.phone = '';
                state.email = '';
                state.website = '';
                state.comments = '';
                state.status = '';
                state.newCompany = action.payload; // Store the newly added company data
            })
            .addCase(addCompany.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setName, setDescription, setPhone, setEmail, setWebsite, setComments, setStatus } = addCompanySlice.actions;
export default addCompanySlice.reducer;