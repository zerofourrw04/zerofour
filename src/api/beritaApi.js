import api from './axios'

export const getBerita = (params) => api.get('/berita', { params })
export const getBeritaDetail = (slug) => api.get(`/berita/${slug}`)
export const createBerita = (data) => api.post('/berita', data)
export const updateBerita = (id, data) => api.put(`/berita/${id}`, data)
export const deleteBerita = (id) => api.delete(`/berita/${id}`)