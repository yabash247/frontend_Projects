import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchStaffLevel, clearStaffLevel } from '../../features/staff/staffLevelSlice';
import { useParams } from 'react-router-dom'; // To get URL parameters

const StaffLevelComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Get userId and companyId from URL parameters
  const { companyId, userId } = useParams<{ companyId: string; userId: string }>();

  // Get accessToken from the auth slice
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Get state from the staffLevel slice
  const { staffLevels, loading, error } = useSelector((state: RootState) => state.staffLevel);

  useEffect(() => {
    // Dispatch fetchStaffLevel if accessToken, companyId, and userId are available
    if (accessToken && companyId && userId) {
      dispatch(fetchStaffLevel({ companyId: Number(companyId), userId: Number(userId), accessToken }));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearStaffLevel());
    };
  }, [dispatch, companyId, userId, accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {staffLevels ? (
        <div>
          <h3>Staff Level Details</h3>
          <p>ID: {staffLevels.id}</p>
          <p>User: {staffLevels.user}</p>
          <p>Company: {staffLevels.company}</p>
          <p>Level: {staffLevels.level}</p>
        </div>
      ) : (
        <p>No staff levels available.</p>
      )}
    </div>
  );
};

export default StaffLevelComponent;

