// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './features/company/companySlice';
import addCompanyReducer from './features/company/addCompanySlice';
import branchReducer from './features/company/branchSlice';
import farmReducer  from './features/company/BSF/farmSlice';
import staffReducer from './features/staff/staffSlice';
import staffLevelReducer from './features/staff/staffLevelSlice';
import addStaffReducer from './features/staff/addStaffSlice';
import authReducer from './features/auth/authSlice'; // Import the auth slice
import userReducer from './features/user/userSlice';
// Import other slices as needed

export const store = configureStore({
  reducer: {
    company: companyReducer,
    companies: addCompanyReducer,
    branches: branchReducer,
    bsffarm: farmReducer,
    staff: staffReducer,
    addStaff: addStaffReducer,
    staffLevel: staffLevelReducer, // Correctly add the staffLevel reducer
    auth: authReducer, // Add the auth slice
    user: userReducer, // Add the user reducer here

    // Add other reducers here
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
