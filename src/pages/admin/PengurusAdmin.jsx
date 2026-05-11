// src/pages/admin/PengurusAdmin.jsx
import { useState, useEffect, useRef } from 'react'
import {
  getPengurus,
  createPengurus,
  updatePengurus,
  deletePengurus,
} from '../../api/pengurusApi'

/* ── Icons ──────────────────────────────────────────────── */
const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
const IconX      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

/* ── Konstanta ──────────────────────────────────────────── */
const FILTER_TABS = [
  { key: 'semua',     label: 'Semua' },
  { key: 'struktur',  label: 'Struktur Organisasi' },
  { key: 'pengelola', label: 'Pengelola Web' },
]

const EMPTY_FORM = {
  nama: '', jabatan: '', no_hp: '', rt: '', periode: '',
  urutan: 0, tipe: 'struktur', instagram: '', whatsapp: '',
  email: '', deskripsi: '', aktif: true,
}

/* ═══════════════════════════════════════════════════════════
 * Halaman Utama
 * ═══════════════════════════════════════════════════════════ */
export default function PengurusAdmin() {
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem,  setEditItem]  = useState(null)
  const [filter,    setFilter]    = useState('semua')
  const [error,     setError]     = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getPengurus()
      const raw = res.data
      setData(Array.isArray(raw) ? raw : (raw?.data ?? []))
    } catch (e) {
      const s = e?.response?.status
      setError(
        s === 401 ? 'Sesi habis. Silakan login ulang.' :
        s === 403 ? 'Anda tidak punya akses.' :
        'Gagal memuat data pengurus.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openTambah = () => { setEditItem(null); setShowModal(true) }
  const openEdit   = (item) => { setEditItem(item); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditItem(null) }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus pengurus ini?')) return
    try { await deletePengurus(id); fetchData() }
    catch { alert('Gagal menghapus. Coba lagi.') }
  }

  const filtered = filter === 'semua'
    ? data
    : data.filter(d => d.tipe === filter)

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Pengurus</h1>
          <p className="text-gray-500 text-sm">Kelola struktur & pengelola web RW.04</p>
        </div>
        <button onClick={openTambah}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-green-400 transition-all text-sm">
          <IconPlus /> Tambah Pengurus
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all
              ${filter === key ? 'bg-primary text-black' : 'bg-dark-400 text-gray-400 hover:text-white'}`}>
            {label}
            <span className="ml-1.5 opacity-60">
              ({key === 'semua' ? data.length : data.filter(d => d.tipe === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="text-xs underline">Coba lagi</button>
        </div>
      )}

      {/* Tabel */}
      <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Belum ada data</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">NAMA</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">JABATAN</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden lg:table-cell">TIPE</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">STATUS</th>
                <th className="text-right text-gray-500 text-xs px-5 py-3 font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-dark-300 transition-colors">
                  {/* Nama + foto */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-400 overflow-hidden flex-shrink-0">
                        {item.foto_url
                          ? <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover"
                              onError={e => { e.currentTarget.style.display = 'none' }} />
                          : <div className="w-full h-full flex items-center justify-center font-bold text-primary text-sm">
                              {item.nama?.charAt(0)?.toUpperCase()}
                            </div>
                        }
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{item.nama}</div>
                        <div className="text-gray-500 text-xs">{item.no_hp || '-'}</div>
                      </div>
                    </div>
                  </td>
                  {/* Jabatan */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="text-gray-300 text-sm">{item.jabatan}</div>
                    {item.periode && <div className="text-gray-600 text-xs">{item.periode}</div>}
                  </td>
                  {/* Tipe */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                      ${item.tipe === 'pengelola'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-violet-500/20 text-violet-400'}`}>
                      {item.tipe === 'pengelola' ? 'Pengelola Web' : 'Struktur'}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${item.aktif ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'}`}>
                      {item.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  {/* Aksi */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 text-xs bg-dark-400 hover:bg-dark-300 text-white px-3 py-1.5 rounded-lg transition-all">
                        <IconEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all">
                        <IconTrash /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <PengurusModal
          editItem={editItem}
          onClose={closeModal}
          onSuccess={() => { closeModal(); fetchData() }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * Modal Tambah / Edit — style mengikuti UmkmAdmin
 * ═══════════════════════════════════════════════════════════ */
function PengurusModal({ editItem, onClose, onSuccess }) {
  const [form,    setForm]    = useState(editItem ? { ...EMPTY_FORM, ...editItem } : EMPTY_FORM)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [preview, setPreview] = useState(editItem?.foto_url || null)
  const [fotoFile, setFotoFile] = useState(null)
  const fileRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Ukuran foto maksimal 2MB.'); return }
    setFotoFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const hapusFoto = () => {
    setPreview(null)
    setFotoFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!form.nama.trim())    { setError('Nama wajib diisi'); return }
    if (!form.jabatan.trim()) { setError('Jabatan wajib diisi'); return }

    setSaving(true)
    setError('')

    try {
      const fd = new FormData()

      Object.entries(form).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') return
        fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v))
      })

      if (fotoFile) fd.append('foto', fotoFile)

      if (editItem) {
        await updatePengurus(editItem.id, fd)
      } else {
        await createPengurus(fd)
      }

      onSuccess()
    } catch (e) {
      const errData = e?.response?.data
      if (errData?.errors) {
        setError(Object.values(errData.errors).flat().join(', '))
      } else {
        setError(errData?.message || 'Gagal menyimpan. Coba lagi.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-100 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header sticky */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-dark-100 z-10">
          <h2 className="text-white font-bold text-lg">
            {editItem ? 'Edit Pengurus' : 'Tambah Pengurus'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Upload Foto */}
          <div>
            <label className="block text-gray-400 text-xs mb-2 font-medium">FOTO PENGURUS</label>
            {preview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-dark-400">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button onClick={hapusFoto}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                  <IconX />
                </button>
                {fotoFile && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                    📎 {fotoFile.name}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary/50 hover:text-primary transition-all">
                <IconUpload />
                <span className="text-sm">Klik untuk upload foto</span>
                <span className="text-xs">JPG, PNG, WEBP — maks 2MB</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={handleFile} />
          </div>

          {/* Tipe */}
          <div>
            <label className="block text-gray-400 text-xs mb-2 font-medium">TIPE <span className="text-red-400">*</span></label>
            <div className="flex gap-4">
              {[['struktur', 'Struktur Organisasi'], ['pengelola', 'Pengelola Web']].map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipe" value={val}
                    checked={form.tipe === val} onChange={() => set('tipe', val)}
                    className="accent-primary" />
                  <span className="text-gray-300 text-sm">{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-medium">NAMA <span className="text-red-400">*</span></label>
            <input value={form.nama} onChange={e => set('nama', e.target.value)}
              placeholder="Nama lengkap"
              className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-medium">JABATAN <span className="text-red-400">*</span></label>
            <input value={form.jabatan} onChange={e => set('jabatan', e.target.value)}
              placeholder={form.tipe === 'struktur' ? 'Ketua RW.04 / Sekretaris / Seksi ...' : 'Admin & Developer / Content Manager / ...'}
              className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
          </div>

          {/* Deskripsi — pengelola saja */}
          {form.tipe === 'pengelola' && (
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-medium">DESKRIPSI</label>
              <textarea value={form.deskripsi || ''} onChange={e => set('deskripsi', e.target.value)}
                rows={2} placeholder="Peran singkat, contoh: Pengembang website dan sistem."
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>
          )}

          {/* No HP + RT/Instagram */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-medium">NO. HP / WA</label>
              <input value={form.no_hp || ''} onChange={e => set('no_hp', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            {form.tipe === 'struktur' ? (
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">RT</label>
                <input value={form.rt || ''} onChange={e => set('rt', e.target.value)}
                  placeholder="01"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            ) : (
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">INSTAGRAM</label>
                <input value={form.instagram || ''} onChange={e => set('instagram', e.target.value)}
                  placeholder="@username"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            )}
          </div>

          {/* Email — pengelola saja */}
          {form.tipe === 'pengelola' && (
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-medium">EMAIL</label>
              <input type="email" value={form.email || ''} onChange={e => set('email', e.target.value)}
                placeholder="nama@zerofour.id"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
          )}

          {/* Periode + Urutan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-medium">PERIODE</label>
              <input value={form.periode || ''} onChange={e => set('periode', e.target.value)}
                placeholder="2023–2026"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-medium">URUTAN TAMPIL</label>
              <input type="number" value={form.urutan ?? 0} min={0}
                onChange={e => set('urutan', Number(e.target.value))}
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
          </div>

          {/* Toggle Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">Status Aktif</div>
              <div className="text-gray-500 text-xs">Tampilkan di halaman publik</div>
            </div>
            <div onClick={() => set('aktif', !form.aktif)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form.aktif ? 'bg-primary' : 'bg-dark-400'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.aktif ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </div>

        </div>

        {/* Footer sticky */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3 sticky bottom-0 bg-dark-100">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Pengurus'}
          </button>
        </div>

      </div>
    </div>
  )
}