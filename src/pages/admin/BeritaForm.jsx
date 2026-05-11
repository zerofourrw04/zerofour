import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBerita, getBeritaDetail, updateBerita } from '../../api/beritaApi'
import { getKategori } from '../../api/kategoriApi'
import api from '../../api/axios'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

export default function BeritaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    judul: '',
    isi: '',
    tanggal: '',
    kategori_id: '',
    tipe: 'berita',
    aktif: 1,
    tampil_beranda: 0,
    thumbnail: '',       // ← string path, bukan File
  })
  const [preview, setPreview]     = useState(null)
  const [uploading, setUploading] = useState(false)
  const [kategori, setKategori]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    // Ambil kategori tipe berita & kegiatan
    getKategori()
      .then(res => {
        const all = res.data?.data ?? res.data ?? []
        setKategori(Array.isArray(all) ? all : [])
      })
      .catch(() => {})

    if (isEdit) {
      getBeritaDetail(id)
        .then(res => {
          const d = res.data?.data ?? res.data
          setForm({
            judul:          d.judul        ?? '',
            isi:            d.isi          ?? '',
            tanggal:        d.tanggal      ?? '',
            kategori_id:    d.kategori_id  ?? '',
            tipe:           d.tipe         ?? 'berita',
            aktif:          d.aktif        ?? 1,
            tampil_beranda: d.tampil_beranda ?? 0,
            thumbnail:      d.thumbnail    ?? '',
          })
          if (d.thumbnail) setPreview(`${STORAGE_URL}/${d.thumbnail}`)
        })
        .catch(() => setError('Gagal memuat data berita'))
    }
  }, [id])

  // Upload foto dulu → dapat path string → simpan ke form.thumbnail
  const handleFoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview lokal dulu
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'berita')

      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Backend harus return { path: 'berita/namafile.jpg' }
      const path = res.data?.path ?? res.data?.data?.path ?? ''
      setForm(f => ({ ...f, thumbnail: path }))
    } catch {
      setError('Gagal mengupload foto. Coba lagi.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (uploading) { setError('Tunggu foto selesai diupload'); return }
    setLoading(true)
    setError('')

    try {
      // Kirim sebagai JSON biasa, thumbnail sudah berupa string path
      if (isEdit) {
        await updateBerita(id, form)
      } else {
        await createBerita(form)
      }
      navigate('/admin/berita')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  // Filter kategori sesuai tipe yang dipilih
  const kategoriFiltered = kategori.filter(k =>
    k.tipe === form.tipe || k.tipe === 'berita' || k.tipe === 'kegiatan'
  )

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/berita')}
          className="text-gray-400 hover:text-white transition-colors">
          ← Kembali
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Edit' : 'Tambah'} Berita
        </h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Thumbnail */}
        <div className="bg-dark-200 border border-white/5 rounded-2xl p-5">
          <label className="text-gray-400 text-sm mb-3 block">Foto / Thumbnail</label>
          <div className="flex items-start gap-4">
            <div className="w-32 h-24 bg-dark-400 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover"/>
                : <span className="text-3xl">📷</span>
              }
            </div>
            <div className="flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={handleFoto}
                className="hidden" id="foto-input" disabled={uploading}/>
              <label htmlFor="foto-input"
                className={`cursor-pointer border border-white/10 text-white text-sm px-4 py-2 rounded-lg transition-all inline-block
                  ${uploading ? 'bg-dark-400 opacity-50 cursor-not-allowed' : 'bg-dark-300 hover:bg-dark-400'}`}>
                {uploading ? 'Mengupload...' : 'Pilih Foto'}
              </label>
              <p className="text-gray-600 text-xs">JPG, PNG, WebP. Maks 2MB</p>
              {form.thumbnail && !uploading && (
                <p className="text-green-500 text-xs">✓ Foto terupload</p>
              )}
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="bg-dark-200 border border-white/5 rounded-2xl p-5 flex flex-col gap-4">

          {/* Judul */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Judul *</label>
            <input type="text" placeholder="Judul berita..."
              value={form.judul}
              onChange={e => setForm({ ...form, judul: e.target.value })}
              className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
              required/>
          </div>

          {/* Kategori & Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Kategori</label>
              <select value={form.kategori_id}
                onChange={e => setForm({ ...form, kategori_id: e.target.value })}
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                <option value="">Pilih kategori</option>
                {kategoriFiltered.map(k => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Tanggal *</label>
              <input type="date" value={form.tanggal}
                onChange={e => setForm({ ...form, tanggal: e.target.value })}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                required/>
            </div>
          </div>

          {/* Tipe */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Tipe</label>
            <div className="flex gap-3">
              {['berita', 'kegiatan'].map(t => (
                <button type="button" key={t}
                  onClick={() => setForm({ ...form, tipe: t, kategori_id: '' })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                    ${form.tipe === t
                      ? 'bg-primary text-black'
                      : 'bg-dark-300 text-gray-400 hover:text-white'}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Isi */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Isi / Konten *</label>
            <textarea placeholder="Tulis isi berita di sini..."
              value={form.isi}
              onChange={e => setForm({ ...form, isi: e.target.value })}
              rows={8}
              className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
              required/>
          </div>

          {/* Toggle */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.aktif == 1}
                onChange={e => setForm({ ...form, aktif: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 accent-primary"/>
              <span className="text-gray-300 text-sm">Aktif / Tampilkan</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.tampil_beranda == 1}
                onChange={e => setForm({ ...form, tampil_beranda: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 accent-primary"/>
              <span className="text-gray-300 text-sm">Tampil di Beranda</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/berita')}
            className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm">
            Batal
          </button>
          <button type="submit" disabled={loading || uploading}
            className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:bg-green-400 transition-all disabled:opacity-50 text-sm">
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Berita'}
          </button>
        </div>
      </form>
    </div>
  )
}