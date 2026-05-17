import api from './axios';
export const getBuses = () => api.get('/buses');
export const getBusById = (id) => api.get(`/buses/${id}`);
