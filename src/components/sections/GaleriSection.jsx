import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getGaleri } from '../../api/galeriApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const dummyGaleri = [
  { id: 1, judul: 'Kegiatan Sosial'  },
  { id: 2, judul: 'Pengajian Rutin'  },
  { id: 3, judul: '17 Agustus'       },
  { id: 4, judul: 'Zero Four Night'  },
  { id: 5, judul: 'Gotong Royong'    },
  { id: 6, judul: 'Santunan Yatim'   },
]

const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

export default function GaleriSection() {
  const [galeri, setGaleri] = useState(dummyGaleri)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGaleri({ limit: 6, tampil_beranda: 1 })
      .then((res) => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        setGaleri(Array.isArray(result) && result.length > 0 ? result : dummyGaleri)
      })
      .catch(() => setGaleri(dummyGaleri))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="font-bold text-white text-lg">Galeri Kegiatan</h3>
        </div>
        <Link to="/galeri" className="text-primary text-sm hover:underline flex items-center gap-1">
          Lihat Semua ›
        </Link>
      </div>

      {/* Grid galeri */}
      {loading ? (
        <div className="grid grid-cols-3 gap-2 h-48">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-dark-400 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows:    'auto auto auto',
          }}
        >
          {galeri.map((item, i) => {
            const fotoUrl = item.foto ? `${STORAGE_URL}/${item.foto}` : null
            const isBig = i === 0

            return (
              <Link
                to="/galeri"
                key={item.id}
                title={item.judul}
                style={isBig ? { gridColumn: '1 / 3', gridRow: '1 / 3' } : {}}
                className={[
                  'block rounded-lg overflow-hidden group relative',
                  'bg-dark-400 hover:opacity-90 transition-all duration-200',
                  isBig ? 'h-48' : 'h-[92px]',
                ].join(' ')}
              >
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-dark-400 flex items-center justify-center text-gray-600">
                    <IconCamera />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                  <span className="text-white text-xs font-semibold line-clamp-1">{item.judul}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
