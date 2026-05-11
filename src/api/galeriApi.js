import api from './axios'

export const getGaleri = (params) => api.get('/galeri', { params })
export const getGaleriDetail = (id) => api.get(`/galeri/${id}`)
export const createGaleri = (data) => api.post('/galeri', data)
export const updateGaleri = (id, data) => api.put(`/galeri/${id}`, data)
export const deleteGaleri = (id) => api.delete(`/galeri/${id}`)