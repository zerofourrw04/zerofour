import { useState, useEffect } from 'react'
import {
  getPengurus,
  updatePengurus,
} from '../../api/pengurusApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const fotoUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}

/* ── Icons ── */
const IconEdit  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconX     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconSave  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconUser  = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

/* ── Avatar ── */
function Avatar({ foto, nama, size = 'md' }) {
  const inisial = nama?.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() || '?'
  const cls = size === 'lg'
    ? 'w-16 h-16 text-xl rounded-xl'
    : 'w-12 h-12 text-sm rounded-xl'
  return (
    <div className={`${cls} bg-dark-400 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-primary`}>
      {foto
        ? <img src={foto} alt={nama} className="w-full h-full object-cover object-top"
            onError={e => { e.currentTarget.style.display='none' }}/>
        : <span>{inisial}</span>
      }
    </div>
  )
}

const TABS = [
  { key: 'semua',     label: 'Semua' },
  { key: 'struktur',  label: 'Struktur Organisasi' },
  { key: 'pengelola', label: 'Pengelola Web' },
]

/* ══════════════════════════════════════════════════════════
 * Halaman Utama
 * ══════════════════════════════════════════════════════════ */
export default function ProfilAdmin() {
  const [data,     setData]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('semua')
  const [selected, setSelected] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getPengurus()
      const raw = res.data
      setData(Array.isArray(raw) ? raw : (raw?.data ?? []))
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = tab === 'semua' ? data : data.filter(d => d.tipe === tab)

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Kelola Profil</h1>
        <p className="text-gray-500 text-sm">Klik kartu untuk mengisi biodata lengkap masing-masing individu</p>
      </div>

      {/* Tab filter */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all
              ${tab === key ? 'bg-primary text-black' : 'bg-dark-400 text-gray-400 hover:text-white'}`}>
            {label}
            <span className="ml-1.5 opacity-60">
              ({key === 'semua' ? data.length : data.filter(d => d.tipe === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Konten */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <IconUser />
            <p className="text-sm">Belum ada data pengurus</p>
            <p className="text-xs">Tambah pengurus terlebih dahulu di menu <span className="text-primary">Pengurus</span></p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...filtered]
            .sort((a, b) => (a.urutan ?? 99) - (b.urutan ?? 99))
            .map(item => (
              <KartuPengurus
                key={item.id}
                item={item}
                onClick={() => setSelected(item)}
              />
            ))}
        </div>
      )}

      {/* Modal Edit Biodata */}
      {selected && (
        <ModalEditProfil
          item={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => { setSelected(null); fetchData() }}
        />
      )}
    </div>
  )
}

/* ── Kartu Pengurus ── */
function KartuPengurus({ item, onClick }) {
  const foto = item.foto_url || fotoUrl(item.foto)
  const tipeBadge = item.tipe === 'pengelola'
    ? 'bg-blue-500/20 text-blue-400'
    : 'bg-violet-500/20 text-violet-400'
  const tipeLabel = item.tipe === 'pengelola' ? 'Pengelola Web' : 'Struktur'
  const hasDetail = item.deskripsi || item.whatsapp || item.instagram || item.email

  return (
    <div
      onClick={onClick}
      className="bg-dark-200 border border-white/5 rounded-2xl p-4 flex items-start gap-4 cursor-pointer hover:border-primary/30 hover:bg-dark-300 transition-all group"
    >
      <Avatar foto={foto} nama={item.nama} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white text-sm font-semibold leading-tight truncate">{item.nama}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${tipeBadge}`}>
            {tipeLabel}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-3 truncate">{item.jabatan}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${item.aktif ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'}`}>
              {item.aktif ? 'Aktif' : 'Nonaktif'}
            </span>
            {hasDetail
              ? <span className="text-xs text-gray-600">✓ lengkap</span>
              : <span className="text-xs text-yellow-600/70">⚠ belum diisi</span>
            }
          </div>
          <span className="text-gray-600 group-hover:text-primary transition-colors text-xs flex items-center gap-1">
            <IconEdit /> Edit
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Modal Edit Biodata Lengkap ── */
function ModalEditProfil({ item, onClose, onSuccess }) {
  const foto = item.foto_url || fotoUrl(item.foto)

  const [form, setForm] = useState({
    nama:      item.nama      || '',
    jabatan:   item.jabatan   || '',
    deskripsi: item.deskripsi || '',
    no_hp:     item.no_hp     || '',
    whatsapp:  item.whatsapp  || '',
    instagram: item.instagram || '',
    email:     item.email     || '',
    rt:        item.rt        || '',
    periode:   item.periode   || '',
    urutan:    item.urutan    ?? 0,
    tipe:      item.tipe      || 'struktur',
    aktif:     item.aktif     !== false,
  })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.nama.trim()) { setError('Nama wajib diisi'); return }
    setSaving(true); setError(''); setSuccess(false)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v === null || v === undefined) return
        fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v))
      })
      await updatePengurus(item.id, fd)
      setSuccess(true)
      setTimeout(() => onSuccess(), 800)
    } catch (e) {
      setError(e?.response?.data?.message || 'Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-100 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header sticky */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-dark-100 z-10">
          <div className="flex items-center gap-3">
            <Avatar foto={foto} nama={form.nama} size="lg" />
            <div>
              <h2 className="text-white font-bold text-base">{form.nama}</h2>
              <p className="text-gray-500 text-xs">{form.jabatan}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-4 flex-shrink-0">
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
          {success && (
            <div className="bg-primary/10 border border-primary/30 text-primary text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <IconCheck /> Berhasil disimpan
            </div>
          )}

          {/* Hint */}
          <div className="bg-dark-300 border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed">
            💡 Untuk mengubah <span className="text-gray-400">nama, jabatan, foto, atau urutan</span> — gunakan menu <span className="text-primary font-medium">Pengurus</span>.
          </div>

          {/* ── Tentang ── */}
          <Divider label="TENTANG" />
          <Field label="DESKRIPSI SINGKAT">
            <textarea
              value={form.deskripsi}
              onChange={e => set('deskripsi', e.target.value)}
              rows={3}
              placeholder="Ceritakan peran atau latar belakang singkat..."
              className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </Field>

          {/* ── Kontak ── */}
          <Divider label="KONTAK" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="NO. HP">
              <input value={form.no_hp} onChange={e => set('no_hp', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </Field>
            <Field label="WHATSAPP">
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                placeholder="628xxxxxxxxx"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="INSTAGRAM">
              <input value={form.instagram} onChange={e => set('instagram', e.target.value)}
                placeholder="@username"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </Field>
            <Field label="EMAIL">
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
            </Field>
          </div>

          {/* RT — hanya struktur */}
          {form.tipe === 'struktur' && (
            <>
              <Divider label="LOKASI" />
              <Field label="RUKUN TETANGGA (RT)">
                <input value={form.rt} onChange={e => set('rt', e.target.value)}
                  placeholder="01"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors" />
              </Field>
            </>
          )}

        </div>

        {/* Footer sticky */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3 sticky bottom-0 bg-dark-100">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {saving ? (
              <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/> Menyimpan...</>
            ) : (
              <><IconSave /> Simpan Biodata</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

/* ── Helpers ── */
function Divider({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-white/5" />
      <span className="text-gray-600 text-xs font-medium tracking-wider">{label}</span>
      <div className="h-px flex-1 bg-white/5" />
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