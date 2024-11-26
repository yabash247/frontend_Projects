// src/api/authorityApi.ts
import axios from 'axios';

export const addAuthority = async (data: { company: number; model_name: string; level: number }) => {
  const response = await axios.post('/api/authorities/add/', data);
  return response.data;
};

export const fetchAuthorities = async () => {
  const response = await axios.get('/api/authorities/');
  return response.data;
};
