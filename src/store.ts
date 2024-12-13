import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './features/company/companySlice';
import addCompanyReducer from './features/company/addCompanySlice';
import branchReducer from './features/company/branchSlice';
import staffMemberReducer from './features/company/staffMemberSlice';
import farmReducer from './features/company/BSF/farmSlice';
import staffReducer from './features/staff/staffSlice';
import staffLevelReducer from './features/staff/staffLevelSlice';
import addStaffReducer from './features/staff/addStaffSlice';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import batchReducer from './features/bsf/batchSlice';
import netUseStatsReducer from './features/bsf/netUseStatsSlices';
import netReducer from './features/bsf/netSlice'; // Import the new Net slice
import durationSettingsReducer from "./features/bsf/durationSettingsSlice";
import EditNetUseStatsReducer from './features/bsf/EditNetUseStatsSlice';
import bsfPondsReducer from './features/bsf/bsfPondsSlice';


export const store = configureStore({
  reducer: {
    company: companyReducer,
    companies: addCompanyReducer,
    branches: branchReducer,
    bsffarm: farmReducer,
    staff: staffReducer,
    staffMember: staffMemberReducer,
    addStaff: addStaffReducer,
    staffLevel: staffLevelReducer,
    auth: authReducer,
    user: userReducer,
    batch: batchReducer,
    netUseStats: netUseStatsReducer,
    editNetUseStats: EditNetUseStatsReducer,
    nets: netReducer, // Add the new Net slice
    bsfPonds: bsfPondsReducer,
    durationSettings: durationSettingsReducer,
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
