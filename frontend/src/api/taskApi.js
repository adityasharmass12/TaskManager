import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/tasks',
});

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
