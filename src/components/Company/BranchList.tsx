import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches, clearError } from "../../features/company/branchSlice";
import { RootState, AppDispatch } from "../../store"
import "../../styles/BranchList.css";

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
              <td>{branch.name}</td>
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

