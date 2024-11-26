// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './features/company/companySlice';
import staffReducer from './features/staff/staffSlice';
import authReducer from './features/auth/authSlice'; // Import the auth slice
// Import other slices as needed

export const store = configureStore({
  reducer: {
    company: companyReducer,
    staff: staffReducer,
    auth: authReducer, // Add the auth slice
    // Add other reducers here
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
