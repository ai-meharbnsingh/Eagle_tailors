import axios from 'axios';

// Use environment variable for production, fallback to /api for local development
// VITE_API_URL should be the base URL (e.g., https://eagle-tailors-api.onrender.com)
const baseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = baseUrl ? `${baseUrl}/api` : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer APIs
export const customerAPI = {
  create: (data) => api.post('/customers', data),
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  search: (query, type = 'phone') => api.get('/customers/search', { params: { q: query, type } }),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  addPhone: (id, phone) => api.post(`/customers/${id}/phones`, phone),
  setPrimaryPhone: (id, phoneId) => api.put(`/customers/${id}/phones/${phoneId}/primary`),
  deletePhone: (id, phoneId) => api.delete(`/customers/${id}/phones/${phoneId}`),
};

// Bill APIs
export const billAPI = {
  create: (formData) => api.post('/bills', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/bills', { params }),
  getById: (id) => api.get(`/bills/${id}`),
  getByFolio: (folio, bookId) => api.get(`/bills/folio/${folio}`, { params: { bookId } }),
  getByCustomer: (customerId) => api.get(`/bills/customer/${customerId}`),
  getDueDeliveries: (date) => api.get('/bills/due-deliveries', { params: { date } }),
  getPendingPayments: () => api.get('/bills/pending-payments'),
  getStats: (bookId) => api.get('/bills/stats', { params: { bookId } }),
  update: (id, data) => api.put(`/bills/${id}`, data),
  delete: (id) => api.delete(`/bills/${id}`),
};

// Book APIs
export const bookAPI = {
  create: (data) => api.post('/books', data),
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  getCurrent: () => api.get('/books/current'),
  getNextFolio: (id) => api.get(`/books/${id}/next-folio`),
  checkFolio: (id, folio) => api.get(`/books/${id}/check-folio`, { params: { folio } }),
  update: (id, data) => api.put(`/books/${id}`, data),
  setCurrent: (id) => api.put(`/books/${id}/set-current`),
  delete: (id) => api.delete(`/books/${id}`),
};

export default api;
