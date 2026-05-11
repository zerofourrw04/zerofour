import { useState, useEffect } from 'react'
import { getPengurusPublik } from '../../api/pengurusApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const fotoUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}

/* ── Icon WA ── */
const IconWa = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)
const IconIg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.38a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
)

/* ── Avatar placeholder ── */
const AvatarPlaceholder = ({ nama }) => {
  const inisial = nama?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #8B7355 0%, #6B5B45 100%)',
      fontSize: '2.5rem', fontWeight: '700', color: '#F5ECD7', fontFamily: "'Playfair Display', serif",
      letterSpacing: '0.05em'
    }}>
      {inisial}
    </div>
  )
}

/* ── Ornament SVG ── */
const OrnamentLine = ({ color = '#C4AA85' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
    <div style={{ height: '1px', flex: 1, maxWidth: '80px', background: `linear-gradient(to right, transparent, ${color})` }}/>
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" fill={color}/>
    </svg>
    <div style={{ height: '1px', flex: 1, maxWidth: '80px', background: `linear-gradient(to left, transparent, ${color})` }}/>
  </div>
)

export default function HalamanPengurus() {
  const [strukturData, setStrukturData] = useState([])
  const [pengelolaData, setPengelolaData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('struktur') // 'struktur' | 'pengelola'

  useEffect(() => {
    getPengurusPublik()
      .then(res => {
        const all = res.data?.data ?? res.data ?? []
        const arr = Array.isArray(all) ? all : all.data ?? []
        setStrukturData(arr.filter(p => p.tipe === 'struktur' && p.aktif !== false))
        setPengelolaData(arr.filter(p => p.tipe === 'pengelola' && p.aktif !== false))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeData = tab === 'struktur' ? strukturData : pengelolaData

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .peng-page { font-family: 'Lora', serif; }

        .peng-card {
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .peng-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(80,55,30,0.22) !important;
        }
        .peng-card:hover .card-foto-wrap {
          border-color: #8B7355 !important;
        }

        .tab-btn {
          font-family: 'Lora', serif;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          padding: 8px 28px;
          border-radius: 2px;
          cursor: pointer;
          border: 1.5px solid #8B7355;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          background: #8B7355;
          color: #F5ECD7;
        }
        .tab-btn.inactive {
          background: transparent;
          color: #8B7355;
        }
        .tab-btn.inactive:hover {
          background: #8B735520;
        }

        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(30,20,10,0.75);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity:0; transform: translateY(24px) } to { opacity:1; transform: translateY(0) } }

        .modal-box {
          animation: slideUp 0.25s ease;
        }

        .contact-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 2px;
          font-family: 'Lora', serif; font-size: 0.8rem;
          text-decoration: none; transition: all 0.2s ease;
          border: 1.5px solid;
        }

        .badge-jabatan {
          display: inline-block;
          padding: 3px 14px;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'Lora', serif;
        }

        @keyframes spin { to { transform: rotate(360deg) } }
        .loader { animation: spin 1s linear infinite; }
      `}</style>

      <div className="peng-page" style={{
        minHeight: '100vh',
        background: '#FAF6EE',
        color: '#3D2B1F',
      }}>

        {/* ── Hero / Header ── */}
        <div style={{
          background: 'linear-gradient(160deg, #3D2B1F 0%, #5C3D2E 50%, #7A5240 100%)',
          padding: '72px 20px 56px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Batik-inspired background pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(45deg, #D4A96A 0px, #D4A96A 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, #D4A96A 0px, #D4A96A 1px, transparent 1px, transparent 20px)`,
          }}/>

          <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
            <p style={{
              fontFamily: "'Lora', serif", fontSize: '0.78rem', letterSpacing: '0.22em',
              color: '#D4A96A', textTransform: 'uppercase', marginBottom: '14px', opacity: 0.9
            }}>
              Warga RW.04
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '700', color: '#F5ECD7',
              lineHeight: '1.2', marginBottom: '18px',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)'
            }}>
              Struktur & Pengelola
            </h1>
            <OrnamentLine />
            <p style={{
              marginTop: '18px', color: '#C9A97A', fontStyle: 'italic',
              fontSize: '0.95rem', lineHeight: '1.7'
            }}>
              Mengenal lebih dekat mereka yang mengabdi untuk kemajuan bersama
            </p>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0',
          padding: '36px 20px 0',
        }}>
          <div style={{
            display: 'inline-flex', border: '1.5px solid #8B7355', borderRadius: '3px', overflow: 'hidden'
          }}>
            {[
              { key: 'struktur',  label: 'Pengurus RW' },
              { key: 'pengelola', label: 'Pengelola Web' },
            ].map(({ key, label }) => (
              <button key={key}
                onClick={() => setTab(key)}
                style={{
                  fontFamily: "'Lora', serif", fontSize: '0.83rem',
                  letterSpacing: '0.08em', padding: '9px 28px', cursor: 'pointer',
                  border: 'none', borderRight: key === 'struktur' ? '1.5px solid #8B7355' : 'none',
                  background: tab === key ? '#8B7355' : 'transparent',
                  color: tab === key ? '#F5ECD7' : '#8B7355',
                  transition: 'all 0.2s ease',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Garis Ornamen ── */}
        <div style={{ padding: '28px 20px 8px' }}>
          <OrnamentLine />
        </div>

        {/* ── Grid Kartu ── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 20px 80px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#8B7355' }}>
              <div style={{
                width: '36px', height: '36px', border: '3px solid #D4A96A40',
                borderTop: '3px solid #8B7355', borderRadius: '50%',
                margin: '0 auto 16px',
              }} className="loader"/>
              <p style={{ fontStyle: 'italic', opacity: 0.7 }}>Memuat data pengurus...</p>
            </div>
          ) : activeData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#8B7355', fontStyle: 'italic', opacity: 0.6 }}>
              Belum ada data
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '28px',
            }}>
              {activeData
                .sort((a, b) => (a.urutan ?? 99) - (b.urutan ?? 99))
                .map((item, i) => (
                  <PengurusCard
                    key={item.id}
                    item={item}
                    delay={i * 60}
                    onClick={() => setSelected(item)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Detail ── */}
      {selected && (
        <ModalDetail item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

/* ── Card Komponen ── */
function PengurusCard({ item, delay, onClick }) {
  const foto = item.foto_url || fotoUrl(item.foto)

  return (
    <div className="peng-card"
      onClick={onClick}
      style={{
        background: '#FFFDF7',
        border: '1px solid #D4C4A8',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(80,55,30,0.10)',
        animationDelay: `${delay}ms`,
      }}>

      {/* Foto */}
      <div style={{ position: 'relative', paddingTop: '110%', background: '#EDE3D0' }}>
        <div style={{
          position: 'absolute', inset: 0,
          overflow: 'hidden',
        }}>
          {foto ? (
            <img src={foto} alt={item.nama}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <AvatarPlaceholder nama={item.nama} />
          )}
        </div>

        {/* Badge jabatan overlay bawah */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(30,18,10,0.82) 0%, transparent 100%)',
          padding: '32px 12px 12px',
        }}>
          <span className="badge-jabatan" style={{
            background: '#8B7355', color: '#F5ECD7',
            fontFamily: "'Lora', serif",
          }}>
            {item.jabatan}
          </span>
        </div>
      </div>

      {/* Info bawah */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1rem', fontWeight: '600',
          color: '#3D2B1F', lineHeight: '1.3',
          marginBottom: '6px',
        }}>
          {item.nama}
        </h3>
        {item.periode && (
          <p style={{
            fontSize: '0.72rem', color: '#8B7355',
            letterSpacing: '0.08em', fontStyle: 'italic',
          }}>
            Periode {item.periode}
          </p>
        )}
        {item.rt && (
          <p style={{ fontSize: '0.75rem', color: '#A08060', marginTop: '4px' }}>
            RT.{item.rt}
          </p>
        )}
        {/* Hint klik */}
        <p style={{
          marginTop: '10px', fontSize: '0.7rem', color: '#B09070',
          letterSpacing: '0.06em', fontStyle: 'italic',
        }}>
          Klik untuk detail →
        </p>
      </div>
    </div>
  )
}

/* ── Modal Detail ── */
function ModalDetail({ item, onClose }) {
  const foto = item.foto_url || fotoUrl(item.foto)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFDF7',
          border: '1px solid #C4AA85',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(30,18,10,0.4)',
          position: 'relative',
        }}>

        {/* Header coklat */}
        <div style={{
          background: 'linear-gradient(135deg, #3D2B1F 0%, #5C3D2E 100%)',
          padding: '0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: `repeating-linear-gradient(45deg, #D4A96A 0px, #D4A96A 1px, transparent 1px, transparent 16px)`,
          }}/>

          {/* Tombol tutup */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 10,
            background: 'rgba(255,255,255,0.12)', border: 'none', color: '#F5ECD7',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            <IconClose />
          </button>

          {/* Foto + nama */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '20px',
            padding: '28px 24px 24px', position: 'relative',
          }}>
            {/* Foto bulat */}
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              border: '3px solid #D4A96A', overflow: 'hidden', flexShrink: 0,
              background: '#5C3D2E',
            }}>
              {foto ? (
                <img src={foto} alt={item.nama}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <AvatarPlaceholder nama={item.nama} />
              )}
            </div>

            <div style={{ flex: 1, paddingBottom: '4px' }}>
              <span style={{
                display: 'inline-block', background: '#D4A96A',
                color: '#3D2B1F', padding: '2px 12px',
                fontSize: '0.7rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', fontFamily: "'Lora', serif",
                marginBottom: '8px', borderRadius: '1px',
              }}>
                {item.jabatan}
              </span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.3rem', fontWeight: '700',
                color: '#F5ECD7', lineHeight: '1.2',
              }}>
                {item.nama}
              </h2>
              {item.periode && (
                <p style={{
                  color: '#C9A97A', fontSize: '0.78rem',
                  fontStyle: 'italic', marginTop: '4px',
                }}>
                  Periode {item.periode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>

          {/* Info singkat */}
          {(item.rt || item.no_hp) && (
            <div style={{
              background: '#F5ECD7', border: '1px solid #D4C4A8',
              borderRadius: '3px', padding: '14px 16px',
              display: 'flex', flexWrap: 'wrap', gap: '16px',
              marginBottom: '20px',
            }}>
              {item.rt && (
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#8B7355', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Rukun Tetangga</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: '600', color: '#3D2B1F' }}>RT.{item.rt}</p>
                </div>
              )}
              {item.no_hp && (
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#8B7355', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>No. HP</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: '600', color: '#3D2B1F' }}>{item.no_hp}</p>
                </div>
              )}
            </div>
          )}

          {/* Deskripsi */}
          {item.deskripsi && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ height: '1px', width: '24px', background: '#8B7355' }}/>
                <p style={{ fontSize: '0.7rem', color: '#8B7355', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tentang</p>
              </div>
              <p style={{
                fontSize: '0.9rem', color: '#5C3D2E', lineHeight: '1.75',
                fontStyle: 'italic',
              }}>
                {item.deskripsi}
              </p>
            </div>
          )}

          {/* Kontak */}
          {(item.whatsapp || item.instagram || item.email) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ height: '1px', width: '24px', background: '#8B7355' }}/>
                <p style={{ fontSize: '0.7rem', color: '#8B7355', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hubungi</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {item.whatsapp && (
                  <a href={`https://wa.me/${item.whatsapp}`} target="_blank" rel="noreferrer"
                    className="contact-btn"
                    style={{ borderColor: '#25D366', color: '#1a7a40', background: '#f0fdf4' }}>
                    <IconWa /> WhatsApp
                  </a>
                )}
                {item.instagram && (
                  <a href={`https://instagram.com/${item.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
                    className="contact-btn"
                    style={{ borderColor: '#C13584', color: '#C13584', background: '#fdf0f7' }}>
                    <IconIg /> {item.instagram.startsWith('@') ? item.instagram : `@${item.instagram}`}
                  </a>
                )}
                {item.email && (
                  <a href={`mailto:${item.email}`}
                    className="contact-btn"
                    style={{ borderColor: '#8B7355', color: '#5C3D2E', background: '#F5ECD7' }}>
                    <IconMail /> {item.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer ornamen */}
        <div style={{ padding: '0 24px 20px' }}>
          <OrnamentLine />
        </div>
      </div>
    </div>
  )
}