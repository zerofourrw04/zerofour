import { useState, useEffect, useRef } from 'react'
import { getGaleri, createGaleri, updateGaleri, deleteGaleri } from '../../api/galeriApi'
import api from '../../api/axios'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
const IconX      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconCamera = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
const IconBack   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
const IconImages = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>

const emptyForm = { judul: '', keterangan: '', foto: '', tampil_beranda: false }

function groupByJudul(data) {
  const map = {}
  data.forEach((item) => {
    const key = item.judul || '(Tanpa Album)'
    if (!map[key]) map[key] = []
    map[key].push(item)
  })
  return map
}

// Ambil keterangan foto pertama dari album tertentu
function getFirstKeterangan(albums, judulKey) {
  const fotos = albums[judulKey]
  if (!fotos || fotos.length === 0) return ''
  return fotos[0]?.keterangan || ''
}

export default function GaleriAdmin() {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)

  const [view, setView]               = useState('albums')
  const [activeAlbum, setActiveAlbum] = useState(null)

  const [showModal, setShowModal]     = useState(false)
  const [editItem, setEditItem]       = useState(null)
  const [form, setForm]               = useState(emptyForm)
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [previewFoto, setPreviewFoto] = useState(null)
  const [error, setError]             = useState('')
  const [autoFilled, setAutoFilled]   = useState(false)
  const fileRef = useRef()

  const fetchData = () => {
    setLoading(true)
    getGaleri({ limit: 100 })
      .then((res) => setData(res.data?.data || res.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const albums      = groupByJudul(data)
  const albumNames  = Object.keys(albums)
  const activePhotos = activeAlbum ? (albums[activeAlbum] || []) : []

  // ── Modal helpers ──────────────────────────────────────────────────
  const openTambah = () => {
    setEditItem(null)
    const judulDefault     = activeAlbum && activeAlbum !== '(Tanpa Album)' ? activeAlbum : ''
    const keteranganDefault = judulDefault ? getFirstKeterangan(albums, judulDefault) : ''
    const isAutoFilled     = !!keteranganDefault
    setForm({ ...emptyForm, judul: judulDefault, keterangan: keteranganDefault })
    setAutoFilled(isAutoFilled)
    setPreviewFoto(null)
    setError('')
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setForm({
      judul:          item.judul          || '',
      keterangan:     item.keterangan     || '',
      foto:           item.foto           || '',
      tampil_beranda: item.tampil_beranda || false,
    })
    setPreviewFoto(item.foto ? `${STORAGE_URL}/${item.foto}` : null)
    setAutoFilled(false)
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setPreviewFoto(null)
    setAutoFilled(false)
    setError('')
  }

  // ── Handler perubahan judul — auto-fill keterangan ─────────────────
  const handleJudulChange = (e) => {
    const newJudul = e.target.value
    // Cek apakah judul cocok dengan album yang sudah ada
    const autoKet   = getFirstKeterangan(albums, newJudul)
    const isFilled  = !!autoKet
    setForm((f) => ({ ...f, judul: newJudul, keterangan: isFilled ? autoKet : f.keterangan }))
    setAutoFilled(isFilled)
  }

  // ── Upload ─────────────────────────────────────────────────────────
  const handleUploadFoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreviewFoto(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'galeri')
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm((f) => ({ ...f, foto: res.data.path || res.data.url }))
    } catch {
      setError('Gagal upload foto. Coba lagi.')
      setPreviewFoto(null)
    } finally {
      setUploading(false)
    }
  }

  const hapusFoto = () => {
    setPreviewFoto(null)
    setForm((f) => ({ ...f, foto: '' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Simpan ─────────────────────────────────────────────────────────
  const handleSimpan = async () => {
    if (!form.judul.trim()) { setError('Judul / nama album wajib diisi.'); return }
    if (!form.foto)         { setError('Foto wajib diupload.'); return }
    setSaving(true); setError('')
    try {
      if (editItem) await updateGaleri(editItem.id, form)
      else          await createGaleri(form)
      closeModal()
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.')
    } finally {
      setSaving(false)
    }
  }

  // ── Hapus ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus foto ini?')) return
    try {
      await deleteGaleri(id)
      fetchData()
    } catch { alert('Gagal menghapus foto.') }
  }

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view === 'photos' && (
            <button
              onClick={() => { setView('albums'); setActiveAlbum(null) }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <IconBack /> Kembali
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {view === 'albums' ? 'Galeri' : activeAlbum}
            </h1>
            <p className="text-gray-500 text-sm">
              {view === 'albums'
                ? `${albumNames.length} album foto`
                : `${activePhotos.length} foto dalam album ini`}
            </p>
          </div>
        </div>

        <button
          onClick={openTambah}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-green-400 transition-all text-sm"
        >
          <IconPlus /> {view === 'albums' ? 'Tambah Foto' : 'Tambah ke Album'}
        </button>
      </div>

      {/* ── VIEW: Daftar Album ── */}
      {view === 'albums' && (
        <>
          {loading ? (
            <div className="py-20 text-center text-gray-500">Memuat data...</div>
          ) : albumNames.length === 0 ? (
            <div className="py-20 text-center text-gray-500">Belum ada foto di galeri</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albumNames.map((nama) => {
                const fotos = albums[nama]
                const cover = fotos[0]?.foto ? `${STORAGE_URL}/${fotos[0].foto}` : null
                return (
                  <div
                    key={nama}
                    onClick={() => { setActiveAlbum(nama); setView('photos') }}
                    className="bg-dark-200 border border-white/5 rounded-xl overflow-hidden group hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="relative h-40 bg-dark-400 overflow-hidden">
                      {cover ? (
                        <img src={cover} alt={nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-primary/5 to-dark-400">
                          <IconCamera />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <IconImages /> {fotos.length} foto
                      </div>
                      {fotos.some((f) => f.tampil_beranda) && (
                        <div className="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">
                          Beranda
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-white text-sm font-semibold line-clamp-1">{nama}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{fotos.length} foto</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── VIEW: Foto dalam Album ── */}
      {view === 'photos' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activePhotos.map((item) => (
            <div key={item.id} className="bg-dark-200 border border-white/5 rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
              <div className="relative h-40 bg-dark-400">
                {item.foto ? (
                  <img src={`${STORAGE_URL}/${item.foto}`} alt={item.judul} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600"><IconCamera /></div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)}
                    className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm">
                    <IconEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-xs bg-red-500/40 hover:bg-red-500/60 text-white px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm">
                    <IconTrash /> Hapus
                  </button>
                </div>
                {item.tampil_beranda && (
                  <div className="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">Beranda</div>
                )}
              </div>
              <div className="p-3">
                {item.keterangan && (
                  <div className="text-gray-500 text-xs line-clamp-2">{item.keterangan}</div>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.tampil_beranda ? 'bg-primary/20 text-primary' : 'bg-dark-400 text-gray-500'}`}>
                    {item.tampil_beranda ? 'Tampil Beranda' : 'Tidak di Beranda'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-100 border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-dark-100 z-10">
              <h2 className="text-white font-bold text-lg">
                {editItem ? 'Edit Foto' : 'Tambah Foto'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><IconX /></button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              {/* Upload Foto */}
              <div>
                <label className="block text-gray-400 text-xs mb-2 font-medium">FOTO <span className="text-red-400">*</span></label>
                {previewFoto ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-dark-400">
                    <img src={previewFoto} alt="preview" className="w-full h-full object-cover" />
                    <button onClick={hapusFoto} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors"><IconX /></button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-sm">Mengupload...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full h-36 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary/50 hover:text-primary transition-all">
                    <IconUpload />
                    <span className="text-sm">Klik untuk upload foto</span>
                    <span className="text-xs">JPG, PNG, WEBP — maks 2MB</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUploadFoto} />
              </div>

              {/* Judul = Nama Album */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">
                  NAMA ALBUM <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={handleJudulChange}
                  placeholder="Contoh: 17 Agustus 2024"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-gray-600 text-xs mt-1">Foto dengan nama album sama akan dikelompokkan bersama.</p>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">
                  KETERANGAN FOTO
                  {autoFilled && !editItem && (
                    <span className="ml-2 text-primary/80 font-normal normal-case">
                      · diisi otomatis dari album
                    </span>
                  )}
                </label>
                <textarea
                  value={form.keterangan}
                  onChange={(e) => {
                    setAutoFilled(false)
                    setForm({ ...form, keterangan: e.target.value })
                  }}
                  placeholder="Keterangan singkat foto (opsional)..."
                  rows={2}
                  className={`w-full bg-dark-300 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none ${
                    autoFilled && !editItem ? 'border-primary/30' : 'border-white/10'
                  }`}
                />
                {autoFilled && !editItem && (
                  <p className="text-primary/60 text-xs mt-1">
                    Keterangan disamakan dengan foto pertama album ini. Bisa diedit jika perlu.
                  </p>
                )}
              </div>

              {/* Toggle beranda */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-white text-sm font-medium">Tampil di Beranda</div>
                  <div className="text-gray-500 text-xs">Tampilkan di section Galeri Kegiatan</div>
                </div>
                <div
                  onClick={() => setForm({ ...form, tampil_beranda: !form.tampil_beranda })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form.tampil_beranda ? 'bg-primary' : 'bg-dark-400'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.tampil_beranda ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex gap-3 sticky bottom-0 bg-dark-100">
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
                Batal
              </button>
              <button
                onClick={handleSimpan}
                disabled={saving || uploading}
                className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Foto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}