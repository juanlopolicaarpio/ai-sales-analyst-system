import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const demoAPI = {
  getOverview: async () => {
    const response = await api.get('/demo/overview');
    return response.data;
  },
  ask: async (question) => {
    const response = await api.post('/demo/ask', { question });
    return response.data;
  },
};
