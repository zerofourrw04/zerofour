import api from './axios'

export const getUmkm = (params) => api.get('/umkm', { params })
export const getUmkmDetail = (id) => api.get(`/umkm/${id}`)
export const createUmkm = (data) => api.post('/umkm', data)
export const updateUmkm = (id, data) => api.put(`/umkm/${id}`, data)
export const deleteUmkm = (id) => api.delete(`/umkm/${id}`)