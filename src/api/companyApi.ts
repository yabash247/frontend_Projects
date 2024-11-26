// src/api/companyApi.ts
import axios from 'axios';
import { backendURL } from "../utils/Constant"

// Fetch all companies
export const fetchCompanies = async () => {
  const response = await axios.get(backendURL+'/api/company/');
  return response.data;
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
