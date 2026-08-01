import axios from 'axios';

const DEFAULT_BASE = 'http://localhost:5000/api/tasks';
const BASE = import.meta.env.VITE_API_BASE || DEFAULT_BASE;

const API = axios.create({ baseURL: BASE });

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API request failed:', err.config?.method, err.config?.url, err.response?.status, err.message);
    return Promise.reject(err);
  }
);

export const fetchTasks = (search = '') => {
  const params = search ? { search } : {};
  return API.get('/', { params });
};

export const fetchTask = (id) => API.get(`/${id}`);

export const createTask = (data) => API.post('/', data);

export const updateTask = (id, data) => API.put(`/${id}`, data);

export const patchTaskStatus = (id, status) =>
  API.patch(`/${id}/status`, { status });

export const deleteTask = (id) => API.delete(`/${id}`);
