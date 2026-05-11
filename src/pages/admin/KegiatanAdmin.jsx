import { useState, useEffect } from 'react'
import { getKegiatan, deleteKegiatan, createKegiatan, updateKegiatan } from '../../api/kegiatanApi'
import { getGaleri, createGaleri, deleteGaleri } from '../../api/galeriApi'
import api from '../../api/axios'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const STATUS_MAP = {
  akan_datang: { label: 'Akan Datang', className: 'bg-blue-500/20 text-blue-400' },
  berlangsung: { label: 'Berlangsung', className: 'bg-primary/20 text-primary' },
  selesai:     { label: 'Selesai',     className: 'bg-gray-500/20 text-gray-400' },
}

export default function KegiatanAdmin() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [album, setAlbum]     = useState(null)

  const fetchData = () => {
    setLoading(true)
    getKegiatan()
      .then(res => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        setData(Array.isArray(result) ? result : [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus kegiatan ini?')) return
    try {
      await deleteKegiatan(id)
      fetchData()
    } catch {
      alert('Gagal menghapus kegiatan')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kegiatan</h1>
          <p className="text-gray-500 text-sm">Kelola kegiatan & agenda RW</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'tambah' })}
          className="bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-green-400 transition-all text-sm"
        >
          + Tambah Kegiatan
        </button>
      </div>

      {/* Table */}
      <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Belum ada kegiatan</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">KEGIATAN</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">TANGGAL</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">LOKASI</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">STATUS</th>
                <th className="text-right text-gray-500 text-xs px-5 py-3 font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const status = STATUS_MAP[item.status] || STATUS_MAP.selesai
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-dark-300 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-400 overflow-hidden flex-shrink-0">
                          {item.thumbnail
                            ? <img src={`${STORAGE_URL}/${item.thumbnail}`} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-lg">📅</div>
                          }
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium line-clamp-1">{item.judul}</div>
                          <div className="text-gray-500 text-xs">{item.slug || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">{item.tanggal}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs bg-dark-400 text-gray-300 px-2 py-1 rounded-lg">
                        {item.lokasi || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setAlbum({ kegiatan: item })}
                          className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-all"
                        >
                          📷 Foto
                        </button>
                        <button
                          onClick={() => setModal({ mode: 'edit', item })}
                          className="text-xs bg-dark-400 hover:bg-dark-300 text-white px-3 py-1.5 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <KegiatanModal
          mode={modal.mode}
          item={modal.item}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); fetchData() }}
        />
      )}

      {album && (
        <AlbumModal
          kegiatan={album.kegiatan}
          onClose={() => setAlbum(null)}
        />
      )}
    </div>
  )
}

/* ── Modal Album Foto ───────────────────────────────────── */

function AlbumModal({ kegiatan, onClose }) {
  const [fotos, setFotos]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')

  const fetchFotos = () => {
    setLoading(true)
    getGaleri({ berita_id: kegiatan.id })
      .then(res => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        setFotos(Array.isArray(result) ? result : [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFotos() }, [kegiatan.id])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'kegiatan')
        const upRes = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const path = upRes.data?.path ?? upRes.data?.data?.path ?? ''
        await createGaleri({
          foto:      path,
          berita_id: kegiatan.id,
          judul:     kegiatan.judul,
        })
      }
      fetchFotos()
    } catch {
      setError('Gagal mengupload foto. Coba lagi.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus foto ini?')) return
    try {
      await deleteGaleri(id)
      fetchFotos()
    } catch {
      alert('Gagal menghapus foto')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-200 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Album Foto</h2>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{kegiatan.judul}</p>
          </div>
          <button onClick={onClose}
            className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">
            ✕
          </button>
        </div>

        <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-3">{error}</p>
          )}
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" multiple onChange={handleUpload}
              className="hidden" id="album-upload" disabled={uploading} />
            <label htmlFor="album-upload"
              className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium border transition-all
                ${uploading
                  ? 'bg-dark-400 border-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'}`}>
              {uploading ? 'Mengupload...' : '+ Tambah Foto'}
            </label>
            <span className="text-gray-500 text-xs">{fotos.length} foto · Pilih beberapa sekaligus</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="py-10 text-center text-gray-500 text-sm">Memuat foto...</div>
          ) : fotos.length === 0 ? (
            <div className="py-10 text-center text-gray-500 text-sm">
              Belum ada foto. Klik "+ Tambah Foto" untuk upload.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {fotos.map(foto => (
                <div key={foto.id} className="relative group aspect-square rounded-xl overflow-hidden bg-dark-400">
                  <img
                    src={`${STORAGE_URL}/${foto.foto}`}
                    alt={foto.judul || ''}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(foto.id)}
                      className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex-shrink-0">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Modal Form Kegiatan ────────────────────────────────── */

const EMPTY = {
  judul: '', slug: '', isi: '', tanggal: '', waktu: '',
  lokasi: '', kategori_id: '', status: 'akan_datang', aktif: true, thumbnail: '',
}

const inputClass  = "w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
const selectClass = "w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"

function KegiatanModal({ mode, item, onClose, onSuccess }) {
  const [form, setForm]           = useState(item ? { ...item } : EMPTY)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(
    item?.thumbnail ? `${STORAGE_URL}/${item.thumbnail}` : null
  )
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleJudul = (val) => {
    setForm(f => ({
      ...f,
      judul: val,
      slug: mode === 'tambah'
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : f.slug,
    }))
  }

  const handleFoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'kegiatan')
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const path = res.data?.path ?? res.data?.data?.path ?? ''
      setForm(f => ({ ...f, thumbnail: path }))
    } catch {
      setError('Gagal mengupload foto.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.judul || !form.tanggal) { setError('Judul dan tanggal wajib diisi'); return }
    if (uploading) { setError('Tunggu foto selesai diupload'); return }
    setSaving(true); setError('')
    try {
      if (mode === 'tambah') await createKegiatan(form)
      else                   await updateKegiatan(item.id, form)
      onSuccess()
    } catch (e) {
      setError(e?.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-200 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-dark-200 z-10">
          <h2 className="text-white font-bold text-lg">
            {mode === 'tambah' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}
          </h2>
          <button onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>
          )}

          {/* Upload Thumbnail */}
          <Field label="Foto / Thumbnail">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-dark-400 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <span className="text-2xl">📅</span>
                }
              </div>
              <div className="flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={handleFoto}
                  className="hidden" id="kegiatan-foto" disabled={uploading} />
                <label htmlFor="kegiatan-foto"
                  className={`cursor-pointer border border-white/10 text-white text-xs px-3 py-2 rounded-lg transition-all inline-block
                    ${uploading ? 'bg-dark-400 opacity-50 cursor-not-allowed' : 'bg-dark-300 hover:bg-dark-400'}`}>
                  {uploading ? 'Mengupload...' : 'Pilih Foto'}
                </label>
                <span className="text-gray-600 text-xs">JPG, PNG, WebP. Maks 2MB</span>
                {form.thumbnail && !uploading && (
                  <span className="text-green-500 text-xs">✓ Foto terupload</span>
                )}
              </div>
            </div>
          </Field>

          <Field label="Judul Kegiatan *">
            <input value={form.judul} onChange={e => handleJudul(e.target.value)}
              className={inputClass} placeholder="Contoh: Kerja Bakti RW" />
          </Field>

          <Field label="Slug">
            <input value={form.slug || ''} onChange={e => set('slug', e.target.value)}
              className={inputClass} placeholder="kerja-bakti-rw" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal *">
              <input type="date" value={form.tanggal} onChange={e => set('tanggal', e.target.value)}
                className={inputClass} style={{ colorScheme: 'dark' }} />
            </Field>
            <Field label="Waktu">
              <input type="time" value={form.waktu || ''} onChange={e => set('waktu', e.target.value)}
                className={inputClass} style={{ colorScheme: 'dark' }} />
            </Field>
          </div>

          <Field label="Lokasi">
            <input value={form.lokasi || ''} onChange={e => set('lokasi', e.target.value)}
              className={inputClass} placeholder="Balai RW / Lapangan / dll" />
          </Field>

          <Field label="Isi / Deskripsi">
            <textarea value={form.isi || ''} onChange={e => set('isi', e.target.value)}
              className={inputClass + ' resize-none'} rows={4}
              placeholder="Keterangan lengkap kegiatan..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className={selectClass}>
                <option value="akan_datang">Akan Datang</option>
                <option value="berlangsung">Berlangsung</option>
                <option value="selesai">Selesai</option>
              </select>
            </Field>
            <Field label="Aktif">
              <div className="flex items-center h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form.aktif}
                    onChange={e => set('aktif', e.target.checked)}
                    className="w-4 h-4 accent-primary" />
                  <span className="text-gray-300 text-sm">Tampilkan</span>
                </label>
              </div>
            </Field>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3 sticky bottom-0 bg-dark-200">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={saving || uploading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Menyimpan...' : mode === 'tambah' ? 'Tambah Kegiatan' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-400 text-xs font-medium">{label}</label>
      {children}
    </div>
  )
}