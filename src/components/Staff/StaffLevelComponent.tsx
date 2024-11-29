import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchStaffLevel, clearStaffLevel } from '../../features/staff/staffLevelSlice';
import { useParams } from 'react-router-dom'; // To get URL parameters

const StaffLevelComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Get userId and companyId from URL parameters
  const { companyId, userId } = useParams<{ companyId: string; userId: string }>();


  // Get state from the staffLevel slice
  const { staffLevels, loadings, errors } = useSelector((state: RootState) => state.staffLevel);

  useEffect(() => {
    // Dispatch fetchStaffLevel if companyId, and userId are available
    if (companyId && userId) {
      dispatch(fetchStaffLevel({ companyId: Number(companyId), userId: Number(userId) }));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearStaffLevel());
    };
  }, [dispatch, companyId, userId]);

  if (loadings) return <p>Loading...</p>;
  if (errors) return <p>Error: {errors}</p>;

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

