
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendURL } from "../utils/Constant";

const CompanyView: React.FC = () => {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      try {
        const headers = new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Company-ID": id || "", // Include the company ID in the headers
        });

        const response = await fetch(`${backendURL}/api/company/${id}/`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setCompany(data);
          //console.log(data);
        } else {
          console.error("Failed to fetch company details");
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompany();
  }, [id]);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Company List</h2>
      <h4>{company[0].name}</h4>
      <p>{company[0].description}</p>
      {/* Add more company details here */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(`/authorities/${company[0].id}`)}>
          Authority Settings
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(`/staff/${company[0].id}/`)}>
          View Company Staff
        </button>
      </div>

    </div>

  );
};

export default CompanyView;
