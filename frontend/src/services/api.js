import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour logger les requêtes (utile pour le debug)
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// === CATEGORIES ===
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const getCategorySousCategories = (id) => api.get(`/categories/${id}/sous-categories`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// === SOUS-CATEGORIES ===
export const getSousCategories = () => api.get('/sous-categories');
export const getSousCategory = (id) => api.get(`/sous-categories/${id}`);
export const getSousCategoryMateriels = (id) => api.get(`/sous-categories/${id}/materiels`);
export const createSousCategory = (data) => api.post('/sous-categories', data);
export const updateSousCategory = (id, data) => api.put(`/sous-categories/${id}`, data);
export const deleteSousCategory = (id) => api.delete(`/sous-categories/${id}`);

// === MATERIELS ===
export const getMateriels = () => api.get('/materiels');
export const getMateriel = (id) => api.get(`/materiels/${id}`);
export const createMateriel = (data) => api.post('/materiels', data);
export const updateMateriel = (id, data) => api.put(`/materiels/${id}`, data);
export const deleteMateriel = (id) => api.delete(`/materiels/${id}`);

// === CSV IMPORT/EXPORT ===
export const importCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/import/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const exportCSV = () => {
  return api.get('/export/csv', {
    responseType: 'blob',
  });
};

export default api;
