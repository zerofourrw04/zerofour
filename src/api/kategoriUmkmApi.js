import api from './axios'

export const getKategoriUmkm    = (params) => api.get('/kategori-umkm', { params })
export const getKategoriUmkmDetail = (id)  => api.get(`/kategori-umkm/${id}`)
export const createKategoriUmkm = (data)   => api.post('/kategori-umkm', data)
export const updateKategoriUmkm = (id, data) => api.put(`/kategori-umkm/${id}`, data)
export const deleteKategoriUmkm = (id)     => api.delete(`/kategori-umkm/${id}`)