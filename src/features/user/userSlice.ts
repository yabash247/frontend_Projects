import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendURL } from "../../utils/Constant"

interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  users: { [key: number]: UserProfile }; // Add users to the state
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  users: {}, // Initialize users
};

// Fetch profile by ID
export const fetchProfile = createAsyncThunk('user/fetchProfile', async (userId: number, { rejectWithValue }) => {
  const accessToken = localStorage.getItem('accessToken') || ''; // Retrieve token from localStorage or state management
  try {
    const response = await axios.get(`${backendURL}/api/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add token to the Authorization header
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch user by ID
export const fetchUserById = createAsyncThunk('user/fetchById', async (userId: number, { rejectWithValue }) => {
  const accessToken = localStorage.getItem('accessToken') || ''; // Retrieve token from localStorage or state management
  try {
    const response = await axios.get(`${backendURL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add token to the Authorization header
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.users[action.payload.id] = action.payload;
      });
  },
});

export const selectUserById = (state: { user: UserState }, userId: number) => state.user.users[userId];

export default userSlice.reducer;