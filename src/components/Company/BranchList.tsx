import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches, clearError } from "../../features/company/branchSlice";
import { fetchFarmDetails } from "../../features/company/BSF/farmSlice";
import { RootState, AppDispatch } from "../../store"
import "../../styles/BranchList.css";
import { Link } from "react-router-dom";

interface BranchListProps {
  company: number; // Company ID passed as a prop
}

const BranchList: React.FC<BranchListProps> = ({ company }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { branches, loading, error } = useSelector((state: RootState) => state.branches);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchBranches({ accessToken, company }));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, accessToken, company]);

  const handleFarmClick = (farmId: number, appName?: string | undefined) => {
    const validatedAppName = appName || "Unknown App"; // Fallback value for appName
    console.log("Validated App Name:", validatedAppName); // Debugging log
    if (!appName) {
      console.error("appName is undefined"); // Debugging log
      return;
    }

    if (accessToken) {
      dispatch(
        fetchFarmDetails({ companyId: company, farmId, appName: validatedAppName })
      );
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const sortedBranches = [...branches].sort((a, b) =>
    a.appName.localeCompare(b.appName)
  );

 

  return (
    <div className="branch-list">
      <h1>Branch List</h1>
      <table className="branch-table">
        <thead>
          <tr>
            <th>Branch Name</th>
            <th>Status</th>
            <th>App</th>
            <th>Model</th>
            <th>Created At</th>
            <th>Associated Data</th>
          </tr>
        </thead>
        <tbody>
          
          {sortedBranches.map((branch) => (
            <tr key={branch.id}>
              <td>
                {/* Add clickable link */}
                <Link
              to={`/company/branch/${branch.appName}/${company}/${branch.branch_id}/${branch.appName}`}
              
            >
              {branch.name}
            </Link>
              </td>
              <td>{branch.status}</td>
              <td>{branch.appName}</td>
              <td>{branch.modelName}</td>
              <td>{new Date(branch.created_at).toLocaleString()}</td>
              <td>
              <td>
        {branch.associated_data ? (
          <>
            <strong>Farm Id:</strong> {branch.associated_data.id} <br />
            <strong>Status:</strong> {branch.associated_data.status} <br />
            <strong>Created At:</strong> {new Date(branch.associated_data.created_at).toLocaleString()}
          </>
        ) : (
          <em>No associated data</em>
        )}
      </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchList;
