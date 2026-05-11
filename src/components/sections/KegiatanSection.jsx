import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getKegiatan } from '../../api/kegiatanApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const dummyKegiatan = [
  { id: 1, judul: 'Santunan Yatim Piatu', tanggal: '18 Mei 2025', kategori: { nama: 'Santunan', warna: '#22c55e' }, isi: 'Kegiatan rutin santunan anak yatim di lingkungan RW.04.', thumbnail: null },
  { id: 2, judul: 'Pengajian Rutin', tanggal: '12 Mei 2025', kategori: { nama: 'Pengajian', warna: '#3b82f6' }, isi: 'Pengajian rutin bersama warga dan pemuda Zero Four.', thumbnail: null },
  { id: 3, judul: 'Persiapan 17 Agustus', tanggal: '10 Mei 2025', kategori: { nama: '17 Agustus', warna: '#ef4444' }, isi: 'Persiapan lomba dan dekorasi untuk menyambut HUT RI ke-80.', thumbnail: null },
]

export default function KegiatanSection() {
  const [kegiatan, setKegiatan] = useState(dummyKegiatan)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    getKegiatan({ limit: 3 })
      .then(res => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        setKegiatan(Array.isArray(result) && result.length > 0 ? result : dummyKegiatan)
      })
      .catch(() => setKegiatan(dummyKegiatan))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="font-bold text-white text-lg">Kegiatan Terbaru</h3>
        </div>
        <Link to="/berita" className="text-primary text-sm hover:underline flex items-center gap-1">
          Lihat Semua ›
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm">Memuat kegiatan...</div>
        ) : (
          kegiatan.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-dark-200 border border-white/5 rounded-xl hover:border-primary/30 transition-all cursor-pointer">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-dark-400 flex-shrink-0 overflow-hidden">
                {item.thumbnail
                  ? <img src={`${STORAGE_URL}/${item.thumbnail}`} alt={item.judul} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl">📸</div>
                }
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${item.kategori?.warna}20`, color: item.kategori?.warna }}
                  >
                    {item.kategori?.nama ?? 'Kegiatan'}
                  </span>
                </div>
                <div className="font-semibold text-white text-sm truncate">{item.judul}</div>
                <div className="text-gray-500 text-xs mb-1">{item.tanggal}</div>
                <div className="text-gray-400 text-xs line-clamp-2">{item.isi?.replace(/<[^>]*>/g, '')}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}