import api from './axios'

export const getProfil = () => api.get('/profil')
export const updateProfil = (data) => api.put('/profil', data)