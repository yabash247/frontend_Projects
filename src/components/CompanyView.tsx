import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendURL } from "../utils/Constant";

const CompanyView: React.FC = () => {
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
          console.log(data);
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
      <h1>{company[0].name}</h1>
      <p>{company[0].description}</p>
      {/* Add more company details here */}
    </div>
  );
};

export default CompanyView;