// src/pages/public/TentangPage.jsx
import { useEffect, useState } from 'react'
import { getPengurusPublik } from '../../api/pengurusApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const fotoUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}

/* ── Data statis ─────────────────────────────────────────── */
const SEJARAH = [
  {
    tahun: '2018',
    judul: 'Awal Berdiri',
    isi: 'Berawal dari semangat kebersamaan para pemuda RW.04 untuk menciptakan lingkungan yang lebih baik dan solid.',
  },
  {
    tahun: '2020',
    judul: 'Perkembangan Komunitas',
    isi: 'Kegiatan sosial, olahraga, dan budaya mulai aktif dilaksanakan untuk mempererat hubungan warga.',
  },
  {
    tahun: '2022',
    judul: 'Pemberdayaan UMKM',
    isi: 'Fokus pada pengembangan potensi lokal dan mendukung UMKM di lingkungan RW.04.',
  },
  {
    tahun: '2024 - Sekarang',
    judul: 'Inovasi & Digitalisasi',
    isi: 'Mengembangkan platform digital (website) sebagai media informasi, promosi UMKM, dan transparansi kegiatan.',
  },
]

const NILAI = [
  { icon: '👥', judul: 'Kebersamaan',  isi: 'Bersatu dalam perbedaan, bergerak untuk kemajuan bersama.' },
  { icon: '❤️', judul: 'Kepedulian',   isi: 'Peduli terhadap lingkungan, sesama, dan masa depan generasi muda.' },
  { icon: '💡', judul: 'Inovasi',      isi: 'Terus berinovasi dan beradaptasi dengan perkembangan zaman.' },
  { icon: '🛡️', judul: 'Integritas',   isi: 'Menjunjung tinggi kejujuran, tanggung jawab, dan kepercayaan.' },
  { icon: '🤝', judul: 'Kolaborasi',   isi: 'Bekerja sama dengan warga dan pihak lain untuk hasil yang lebih baik.' },
]

const TabIconSejarah = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4ade80' : 'currentColor'} strokeWidth="1.8" style={{ display: 'block' }}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const TabIconStruktur = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4ade80' : 'currentColor'} strokeWidth="1.8" style={{ display: 'block' }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const TabIconPengelola = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4ade80' : 'currentColor'} strokeWidth="1.8" style={{ display: 'block' }}>
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8"/>
    <path d="M12 17v4"/>
  </svg>
)

const TABS = [
  { key: 'sejarah',   Icon: TabIconSejarah,   label: 'Sejarah',            sub: 'Perjalanan Kami' },
  { key: 'struktur',  Icon: TabIconStruktur,  label: 'Struktur Organisasi', sub: 'RW.04 & Pengelola Web' },
  { key: 'pengelola', Icon: TabIconPengelola, label: 'Pengelola Web',       sub: 'Tim di Balik Layar' },
]

const KEYWORDS_KETUA  = ['ketua']
const KEYWORDS_LEVEL2 = ['sekretaris', 'bendahara', 'wakil']
const KEYWORDS_SEKSI  = ['seksi', 'bidang', 'koordinator', 'sie']

/* ── Icon set (dari HalamanPengurus) ── */
const IconWa = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)
const IconIg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.38a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

/* ════════════════════════════════════════════════
 * MODAL BIODATA — dipakai di OrgNode & PengelolaCard
 * ════════════════════════════════════════════════ */
function ModalBiodata({ item, onClose }) {
  const foto = item.foto_url || fotoUrl(item.foto)

  // Tutup dengan Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const waNumber = (item.whatsapp || item.no_hp)
    ?.replace(/\D/g, '')
    ?.replace(/^0/, '62')

  return (
    <>
      <style>{`
        @keyframes backdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .modal-biodata-overlay { animation: backdropIn 0.2s ease; }
        .modal-biodata-box { animation: modalSlideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .bio-contact-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 8px;
          font-size: 0.78rem; font-weight: 500;
          text-decoration: none; transition: all 0.18s ease;
          border: 1px solid;
        }
        .bio-contact-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
      `}</style>

      <div
        className="modal-biodata-overlay"
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
        onClick={onClose}
      >
        <div
          className="modal-biodata-box"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '88vh',
            overflowY: 'auto',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* ── Header gradient ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1f0d 0%, #132613 60%, #1a3a1a 100%)',
            borderRadius: '20px 20px 0 0',
            padding: '28px 24px 24px',
            position: 'relative',
          }}>
            {/* Tombol tutup */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'rgba(255,255,255,0.08)',
                border: 'none', color: 'rgba(255,255,255,0.7)',
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <IconClose />
            </button>

            {/* Foto + nama */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px' }}>
              {/* Avatar */}
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                border: '2.5px solid #4ade80',
                overflow: 'hidden', flexShrink: 0,
                background: '#1a3a1a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: '700', color: '#4ade80',
              }}>
                {foto ? (
                  <img
                    src={foto} alt={item.nama}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  item.nama?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() || '?'
                )}
              </div>

              <div style={{ flex: 1, paddingBottom: '2px' }}>
                {/* Badge jabatan */}
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(74,222,128,0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(74,222,128,0.3)',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.68rem',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  {item.jabatan}
                </span>
                <h2 style={{
                  fontSize: '1.2rem', fontWeight: '700',
                  color: '#fff', lineHeight: '1.25',
                  margin: 0,
                }}>
                  {item.nama}
                </h2>
                {item.periode && (
                  <p style={{
                    color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem',
                    margin: '4px 0 0', fontStyle: 'italic',
                  }}>
                    Periode {item.periode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Info singkat: RT & No HP */}
            {(item.rt || item.no_hp) && (
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex', flexWrap: 'wrap', gap: '20px',
              }}>
                {item.rt && (
                  <div>
                    <p style={{ fontSize: '0.62rem', color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>
                      Rukun Tetangga
                    </p>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', margin: 0 }}>
                      RT.{item.rt}
                    </p>
                  </div>
                )}
                {item.no_hp && (
                  <div>
                    <p style={{ fontSize: '0.62rem', color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>
                      No. HP
                    </p>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', margin: 0 }}>
                      {item.no_hp}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Deskripsi */}
            {item.deskripsi && (
              <div>
                <p style={{
                  fontSize: '0.65rem', color: '#4ade80', letterSpacing: '0.12em',
                  textTransform: 'uppercase', fontWeight: '600', margin: '0 0 8px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ height: '1px', width: '20px', background: '#4ade80', display: 'inline-block' }} />
                  Tentang
                </p>
                <p style={{
                  fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)',
                  lineHeight: '1.75', margin: 0, fontStyle: 'italic',
                }}>
                  {item.deskripsi}
                </p>
              </div>
            )}

            {/* Kontak */}
            {(waNumber || item.instagram || item.email) && (
              <div>
                <p style={{
                  fontSize: '0.65rem', color: '#4ade80', letterSpacing: '0.12em',
                  textTransform: 'uppercase', fontWeight: '600', margin: '0 0 10px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ height: '1px', width: '20px', background: '#4ade80', display: 'inline-block' }} />
                  Hubungi
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank" rel="noreferrer"
                      className="bio-contact-btn"
                      style={{ borderColor: '#25D366', color: '#22c55e', background: 'rgba(34,197,94,0.08)' }}
                    >
                      <IconWa /> WhatsApp
                    </a>
                  )}
                  {item.instagram && (
                    <a
                      href={`https://instagram.com/${item.instagram.replace('@', '')}`}
                      target="_blank" rel="noreferrer"
                      className="bio-contact-btn"
                      style={{ borderColor: '#C13584', color: '#e879a0', background: 'rgba(225,29,143,0.08)' }}
                    >
                      <IconIg /> {item.instagram.startsWith('@') ? item.instagram : `@${item.instagram}`}
                    </a>
                  )}
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="bio-contact-btn"
                      style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)' }}
                    >
                      <IconMail /> {item.email}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Fallback: belum ada biodata tambahan */}
            {!item.deskripsi && !waNumber && !item.instagram && !item.email && !item.rt && !item.no_hp && (
              <div style={{
                textAlign: 'center', padding: '16px 0',
                color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontStyle: 'italic',
              }}>
                Biodata lengkap belum diisi.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════
 * HALAMAN UTAMA
 * ════════════════════════════════════════════════ */
export default function TentangPage() {
  const [struktur,  setStruktur]  = useState([])
  const [pengelola, setPengelola] = useState([])
  const [tab,       setTab]       = useState('sejarah')
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [selected,  setSelected]  = useState(null)   // ← state modal biodata

  const fetchPengurus = () => {
    setLoading(true)
    setError(null)

    getPengurusPublik()
      .then(res => {
        const body = res.data

        if (body?.struktur !== undefined && body?.pengelola !== undefined) {
          setStruktur(body.struktur)
          setPengelola(body.pengelola)
        } else {
          const all = Array.isArray(body) ? body : (body?.data ?? [])
          setStruktur(all.filter(p => p.tipe === 'struktur'))
          setPengelola(all.filter(p => p.tipe === 'pengelola'))
        }
      })
      .catch(() => setError('Gagal memuat data pengurus.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPengurus() }, [])

  /* ── Pisahkan struktur ke level-level org chart ── */
  const sorted = [...struktur].sort((a, b) => (a.urutan ?? 99) - (b.urutan ?? 99))

  const ketua = sorted.find(p => {
    const j = p.jabatan?.toLowerCase() ?? ''
    return KEYWORDS_KETUA.some(k => j.startsWith(k))
  }) ?? sorted[0] ?? null

  const level2 = sorted.filter(p => {
    if (p.id === ketua?.id) return false
    const j = p.jabatan?.toLowerCase() ?? ''
    return KEYWORDS_LEVEL2.some(k => j.includes(k)) || (p.urutan > 1 && p.urutan <= 3)
  })

  const seksiList = sorted.filter(p => {
    if (p.id === ketua?.id) return false
    if (level2.some(l => l.id === p.id)) return false
    const j = p.jabatan?.toLowerCase() ?? ''
    return KEYWORDS_SEKSI.some(k => j.includes(k))
  })

  const anggotaList = sorted.filter(p => {
    if (p.id === ketua?.id) return false
    if (level2.some(l => l.id === p.id)) return false
    if (seksiList.some(s => s.id === p.id)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">

      {/* ── Hero — gaya UMKM ── */}
      <div className="relative overflow-hidden border-b border-white/5 mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#16a34a22_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">Desa Sindang</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Tentang <span className="text-primary">Zero Four RW.04</span>
          </h1>
          <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
            Zero Four adalah komunitas pemuda pemudi yang bergerak di bidang sosial, budaya,
            dan pemberdayaan masyarakat di Desa Sindang, khususnya RW.04.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">

        {/* ── Tab Buttons ── */}
        <div className="flex gap-2 mb-10 flex-wrap" style={{ justifyContent: 'center' }}>
          {TABS.map(({ key, Icon, label, sub }) => {
            const active = tab === key
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  border: `1px solid ${active ? '#4ade80' : 'rgba(255,255,255,0.05)'}`,
                  background: active ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#fff' : '#9ca3af',
                  cursor: 'pointer',
                  minWidth: '130px',
                  gap: '6px',
                }}
              >
                <Icon active={active} />
                <span style={{ fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'center' }}>{sub}</span>
              </button>
            )
          })}
        </div>

        {/* ─────────────────── TAB: SEJARAH ─────────────────── */}
        {tab === 'sejarah' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-dark-200 border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span>📖</span> Sejarah Pemuda Zero Four
              </h2>
              <div className="flex flex-col gap-6">
                {SEJARAH.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1 flex-shrink-0" />
                      {i < SEJARAH.length - 1 && (
                        <div className="w-px flex-1 bg-primary/20 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-primary text-sm font-semibold mb-0.5">{s.tahun}</p>
                      <p className="text-white font-semibold">{s.judul}</p>
                      <p className="text-gray-400 text-sm mt-1">{s.isi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-dark-200 border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span>❤️</span> Nilai Kami
              </h2>
              <div className="flex flex-col gap-4">
                {NILAI.map((n, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
                      {n.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{n.judul}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{n.isi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────── TAB: STRUKTUR ─────────────────── */}
        {tab === 'struktur' && (
          <div className="bg-dark-200 border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span>👥</span> Struktur Organisasi Desa Sindang RW.04
            </h2>
            <p className="text-gray-500 text-xs mb-8">
              Klik kartu untuk melihat biodata lengkap masing-masing pengurus
            </p>

            {loading ? (
              <SkeletonOrgChart />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchPengurus} />
            ) : struktur.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                Belum ada data struktur organisasi.
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0 overflow-x-auto pb-4">

                {/* Level 1: Ketua */}
                {ketua && (
                  <>
                    <OrgNode item={ketua} variant="ketua" onClick={() => setSelected(ketua)} />
                    <div className="w-px h-8 bg-primary/40" />
                  </>
                )}

                {/* Level 2 */}
                {level2.length > 0 && (
                  <>
                    <div className="flex gap-4 justify-center flex-wrap">
                      {level2.map(p => (
                        <OrgNode key={p.id} item={p} variant="madya" onClick={() => setSelected(p)} />
                      ))}
                    </div>
                    <div className="w-px h-8 bg-primary/40" />
                  </>
                )}

                {/* Level 3: Seksi */}
                {seksiList.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {seksiList.map(p => (
                        <OrgNode key={p.id} item={p} variant="seksi" onClick={() => setSelected(p)} />
                      ))}
                    </div>
                    <div className="w-px h-8 bg-primary/40" />
                  </>
                )}

                {/* Level 4: Anggota lainnya */}
                {anggotaList.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {anggotaList.map(p => (
                        <OrgNode key={p.id} item={p} variant="seksi" onClick={() => setSelected(p)} />
                      ))}
                    </div>
                    <div className="w-px h-8 bg-primary/40" />
                  </>
                )}

                {/* Footer: Anggota & Masyarakat */}
                <div className="border border-primary/30 rounded-xl px-8 py-3 text-center bg-primary/5">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-white font-semibold text-sm">Anggota & Masyarakat RW.04</div>
                  <div className="text-primary text-xs">Bersama Membangun Lingkungan</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────── TAB: PENGELOLA ─────────────────── */}
        {tab === 'pengelola' && (
          <div className="bg-dark-200 border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span>💻</span> Pengelola Web Pemuda Zero Four
            </h2>
            <p className="text-gray-500 text-xs mb-8">
              Klik kartu untuk melihat biodata lengkap masing-masing pengelola
            </p>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-dark-400 rounded-2xl h-52 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={fetchPengurus} />
            ) : pengelola.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                Belum ada data pengelola web.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pengelola.map(p => (
                  <PengelolaCard key={p.id} item={p} onClick={() => setSelected(p)} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Modal Biodata (muncul dari OrgNode maupun PengelolaCard) ── */}
      {selected && (
        <ModalBiodata item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

/* ── OrgNode — sekarang clickable & menampilkan hint hover ── */
function OrgNode({ item, variant = 'madya', onClick }) {
  if (!item) return null

  const styles = {
    ketua: {
      wrap:    'px-8 py-4 border-primary bg-primary/10',
      foto:    'w-16 h-16 text-2xl',
      nama:    'text-base',
      jabatan: 'text-xs',
    },
    madya: {
      wrap:    'px-5 py-3 border-white/10 bg-dark-400',
      foto:    'w-12 h-12 text-lg',
      nama:    'text-sm',
      jabatan: 'text-xs',
    },
    seksi: {
      wrap:    'px-4 py-2.5 border-white/10 bg-dark-400',
      foto:    'w-10 h-10 text-base',
      nama:    'text-xs',
      jabatan: 'text-[10px]',
    },
  }

  const s = styles[variant]

  return (
    <div
      onClick={onClick}
      className={`border rounded-xl text-center flex flex-col items-center transition-all cursor-pointer
        hover:border-primary/60 hover:bg-dark-300 hover:scale-105 active:scale-100 group ${s.wrap}`}
      title={`Lihat biodata ${item.nama}`}
    >
      <div className={`rounded-full overflow-hidden bg-dark-300 mb-2 flex items-center justify-center font-bold text-primary flex-shrink-0 ${s.foto}`}>
        {item.foto_url ? (
          <img
            src={item.foto_url}
            alt={item.nama}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          item.nama?.charAt(0)?.toUpperCase()
        )}
      </div>
      <div className={`text-white font-semibold ${s.nama}`}>{item.nama}</div>
      <div className={`text-primary ${s.jabatan}`}>{item.jabatan}</div>
      {item.rt && <div className="text-gray-500 text-[10px] mt-0.5">RT {item.rt}</div>}
      {/* Hint */}
      <div className="text-[9px] text-gray-600 group-hover:text-primary/60 mt-1 transition-colors">
        lihat profil →
      </div>
    </div>
  )
}

/* ── PengelolaCard — sekarang clickable ── */
function PengelolaCard({ item, onClick }) {
  const waNumber = (item.no_hp || item.whatsapp)
    ?.replace(/\D/g, '')
    ?.replace(/^0/, '62')

  return (
    <div
      onClick={onClick}
      className="bg-dark-400 border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3
        hover:border-primary/40 hover:bg-dark-300 transition-all cursor-pointer group hover:scale-[1.02] active:scale-100"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-300 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/40 transition-all">
        {item.foto_url ? (
          <img
            src={item.foto_url}
            alt={item.nama}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          item.nama?.charAt(0)?.toUpperCase()
        )}
      </div>
      <div className="text-center">
        <div className="text-white font-semibold text-sm">{item.nama}</div>
        <div className="text-primary text-xs font-medium">{item.jabatan}</div>
        {item.deskripsi && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>
        )}
      </div>

      {/* Kontak icons (non-clickable, hanya preview) */}
      <div className="flex gap-3 mt-auto">
        {waNumber && (
          <span className="text-green-400 text-lg" title="WhatsApp">📱</span>
        )}
        {item.instagram && (
          <span className="text-pink-400 text-lg" title="Instagram">📸</span>
        )}
        {item.email && (
          <span className="text-blue-400 text-lg" title="Email">✉️</span>
        )}
      </div>

      {/* Hint */}
      <div className="text-xs text-gray-600 group-hover:text-primary/60 transition-colors -mt-1">
        Lihat profil →
      </div>
    </div>
  )
}

/* ── Skeleton ── */
function SkeletonOrgChart() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="w-40 h-24 bg-dark-400 rounded-xl animate-pulse" />
      <div className="w-px h-8 bg-white/10" />
      <div className="flex gap-6">
        {[1, 2].map(i => <div key={i} className="w-32 h-20 bg-dark-400 rounded-xl animate-pulse" />)}
      </div>
      <div className="w-px h-8 bg-white/10" />
      <div className="flex gap-3 flex-wrap justify-center">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-28 h-16 bg-dark-400 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )
}

/* ── Error State ── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-10">
      <p className="text-red-400 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary hover:text-green-400 underline underline-offset-2 transition-colors"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}