import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBerita } from '../../api/beritaApi'
import { getKegiatan } from '../../api/kegiatanApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const TIPE_MAP = {
  berita:   { label: 'Berita',   warna: '#06b6d4' },
  kegiatan: { label: 'Kegiatan', warna: '#22c55e' },
}

export default function BeritaPage() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('semua') // semua | berita | kegiatan

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getBerita().then(res => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        return (Array.isArray(result) ? result : []).map(i => ({ ...i, _tipe: 'berita' }))
      }).catch(() => []),
      getKegiatan().then(res => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        return (Array.isArray(result) ? result : []).map(i => ({ ...i, _tipe: 'kegiatan' }))
      }).catch(() => []),
    ]).then(([berita, kegiatan]) => {
      const merged = [...berita, ...kegiatan].sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      )
      setItems(merged)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'semua'
    ? items
    : items.filter(i => i._tipe === filter)

  const totalBerita   = items.filter(i => i._tipe === 'berita').length
  const totalKegiatan = items.filter(i => i._tipe === 'kegiatan').length

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">

      {/* ── Hero — gaya UMKM ── */}
      <div className="relative overflow-hidden border-b border-white/5 mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#16a34a22_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">RW.04 Zero Four</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Berita & <span className="text-primary">Kegiatan</span>
          </h1>
          <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
            Informasi terbaru, liputan kegiatan, dan kabar terkini dari lingkungan RW.04 Desa Sindang.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-8">
            <div>
              <div className="text-2xl font-black text-white">{items.length}</div>
              <div className="text-gray-500 text-xs mt-0.5">Total Konten</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-black text-white">{totalBerita}</div>
              <div className="text-gray-500 text-xs mt-0.5">Berita</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-black text-primary">{totalKegiatan}</div>
              <div className="text-gray-500 text-xs mt-0.5">Kegiatan</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          {['semua', 'berita', 'kegiatan'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                ${filter === f
                  ? 'bg-primary text-black'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}>
              {f === 'semua' ? 'Semua' : f === 'berita' ? 'Berita' : 'Kegiatan'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-white font-semibold mb-1">Belum ada konten</div>
            <div className="text-gray-500 text-sm">Coba pilih kategori lain</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => {
              const tipe = TIPE_MAP[item._tipe] ?? TIPE_MAP.berita
              return (
                <Link
                  key={`${item._tipe}-${item.id}`}
                  to={item._tipe === 'berita' ? `/berita/${item.slug}` : `/kegiatan/${item.slug}`}
                  className="group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(22,163,74,0.08)] flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img
                        src={`${STORAGE_URL}/${item.thumbnail}`}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-[#1a1a1a] flex items-center justify-center text-5xl">
                        {item._tipe === 'berita' ? '📰' : '📅'}
                      </div>
                    )}

                    {/* Badge tipe */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border"
                        style={{
                          backgroundColor: `${tipe.warna}20`,
                          color: tipe.warna,
                          borderColor: `${tipe.warna}30`,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {tipe.label}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    {item.kategori?.nama && (
                      <span className="text-xs text-gray-500">{item.kategori.nama}</span>
                    )}
                    <div className="text-white font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {item.judul}
                    </div>
                    <div className="text-gray-500 text-xs">{item.tanggal}</div>
                    <div className="text-gray-400 text-xs line-clamp-2 mt-auto pt-1">
                      {item.isi?.replace(/<[^>]*>/g, '')}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10 text-gray-600 text-xs">
            Menampilkan {filtered.length} dari {items.length} konten
          </div>
        )}
      </div>
    </div>
  )
}