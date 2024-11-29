// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './features/company/companySlice';
import addCompanyReducer from './features/company/addCompanySlice';
import staffReducer from './features/staff/staffSlice';
import staffLevelReducer from './features/staff/staffLevelSlice';
import authReducer from './features/auth/authSlice'; // Import the auth slice
import userReducer from './features/user/userSlice';
// Import other slices as needed

export const store = configureStore({
  reducer: {
    company: companyReducer,
    companies: addCompanyReducer,
    staff: staffReducer,
    staffLevel: staffLevelReducer, // Correctly add the staffLevel reducer
    auth: authReducer, // Add the auth slice
    user: userReducer, // Add the user reducer here
    // Add other reducers here
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
