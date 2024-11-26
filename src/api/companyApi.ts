// src/api/companyApi.ts
import axios from 'axios';
import { backendURL } from "../utils/Constant"
import { api } from "../utils/api";

// Fetch all companies
/*
export const fetchCompanies = async () => {
  const response = await axios.get(backendURL+'/api/company/');
  return response.data;
};
*/
export const fetchCompanies = async () => {
  let accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(backendURL + "/api/company/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Send the access token
      },
    });

    if (response.status === 401) {
      // Access token expired, refresh it
      //accessToken = await refreshAccessToken();

      // Retry the original request with the new access token
      const retryResponse = await api(backendURL + "/api/company/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json();
        throw new Error(error.message || "Failed to fetch companies");
      }

      return await retryResponse.json();
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch companies");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching companies:", err);
    throw err;
  }
};






// Add a company
export const addCompany = async (data: any) => {
  const response = await axios.post(backendURL+'/api/company/add/', data);
  return response.data;
};

// Edit a company
export const editCompany = async (id: number, data: any) => {
  const response = await axios.put(backendURL+`/api/company/${id}/edit/`, data);
  return response.data;
};

// Delete a company
export const deleteCompany = async (id: number) => {
  const response = await axios.delete(backendURL+`/api/company/${id}/delete/`);
  return response.data;
};
