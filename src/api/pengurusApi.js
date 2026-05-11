// src/api/pengurusApi.js

import api from './axios'

// ✅ Sinkron dengan route: Route::prefix('admin') → /api/admin/pengurus
const BASE        = '/admin/pengurus'
const BASE_PUBLIK = '/pengurus'

/* ─── Admin (perlu auth token) ─────────────────────────────── */

/**
 * GET /api/admin/pengurus
 * Ambil semua pengurus (aktif + nonaktif) untuk halaman admin.
 */
export const getPengurus = (params) =>
  api.get(BASE, { params })

/**
 * POST /api/admin/pengurus
 */
export const createPengurus = (formData) =>
  api.post(BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * POST /api/admin/pengurus/{id}   (dengan _method=PUT di FormData)
 * Laravel tidak bisa menerima PUT dengan multipart/form-data.
 */
export const updatePengurus = (id, formData) => {
  // Pastikan _method belum di-append sebelumnya
  if (!formData.has('_method')) {
    formData.append('_method', 'PUT')
  }
  return api.post(`${BASE}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * DELETE /api/admin/pengurus/{id}
 */
export const deletePengurus = (id) =>
  api.delete(`${BASE}/${id}`)

/* ─── Publik (tanpa auth) ───────────────────────────────────── */

/**
 * GET /api/pengurus
 * Response: { struktur: [...], pengelola: [...] }
 */
export const getPengurusPublik = (params) =>
  api.get(BASE_PUBLIK, { params })