import { useState, useEffect } from 'react'
import { getUmkm } from '../../api/umkmApi'
import { getKategoriUmkm } from '../../api/kategoriUmkmApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const fotoUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}

const IconWa = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconMap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const fallbackEmoji = {
  Makanan: '🍱', Kuliner: '🍜', Jasa: '✂️', Kerajinan: '🧺',
  Fashion: '👗', Pertanian: '🌾', Teknologi: '💻', Lainnya: '🏪',
}

export default function UmkmPage() {
  const [umkm, setUmkm]         = useState([])
  const [kategori, setKategori] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterKat, setFilterKat] = useState('semua')

  useEffect(() => {
    Promise.all([
      getUmkm({ limit: 100, aktif: 1 }),
      getKategoriUmkm(),
    ]).then(([umkmRes, katRes]) => {
      const umkmData = umkmRes.data?.data ?? umkmRes.data ?? []
      const katData  = katRes.data?.data  ?? katRes.data  ?? []
      setUmkm(Array.isArray(umkmData) ? umkmData : umkmData.data ?? [])
      setKategori(Array.isArray(katData) ? katData : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = umkm.filter((item) => {
    const matchSearch = item.nama_usaha?.toLowerCase().includes(search.toLowerCase()) ||
                        item.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
                        item.nama_pemilik?.toLowerCase().includes(search.toLowerCase())
    const matchKat = filterKat === 'semua' || String(item.kategori_umkm_id) === String(filterKat)
    return matchSearch && matchKat
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5 mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#16a34a22_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">Desa Sindang</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            UMKM <span className="text-primary">Warga RW.04</span>
          </h1>
          <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
            Dukung produk dan jasa lokal dari warga RW.04. Temukan berbagai usaha unggulan di sekitar kita.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-8">
            <div>
              <div className="text-2xl font-black text-white">{umkm.length}</div>
              <div className="text-gray-500 text-xs mt-0.5">Total UMKM</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-black text-white">{kategori.length}</div>
              <div className="text-gray-500 text-xs mt-0.5">Kategori</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-black text-primary">{umkm.filter(u => u.tampil_beranda).length}</div>
              <div className="text-gray-500 text-xs mt-0.5">Unggulan</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Cari nama usaha, produk, atau pemilik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterKat('semua')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterKat === 'semua'
                  ? 'bg-primary text-black'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              Semua
            </button>
            {kategori.map((k) => (
              <button
                key={k.id}
                onClick={() => setFilterKat(String(k.id))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterKat === String(k.id)
                    ? 'bg-primary text-black'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {k.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Grid UMKM */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-white font-semibold mb-1">Tidak ditemukan</div>
            <div className="text-gray-500 text-sm">Coba kata kunci atau kategori lain</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => {
              const kategoriNama = item.kategori?.nama || item.kategori_umkm?.nama || 'Lainnya'
              const emoji        = fallbackEmoji[kategoriNama] || '🏪'
              const foto         = fotoUrl(item.foto)

              return (
                <div key={item.id}
                  className="group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(22,163,74,0.08)] flex flex-col">

                  {/* Foto */}
                  <div className="relative h-44 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    {foto ? (
                      <img
                        src={foto}
                        alt={item.nama_usaha}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      style={{ display: foto ? 'none' : 'flex' }}
                    >
                      {emoji}
                    </div>

                    {/* Badge kategori */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/70 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-lg border border-primary/20">
                        {kategoriNama}
                      </span>
                    </div>

                    {/* Badge unggulan */}
                    {item.tampil_beranda ? (
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary/90 text-black text-xs font-bold px-2 py-0.5 rounded-lg">
                          ⭐ Unggulan
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Konten */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="font-bold text-white text-sm leading-tight mb-1">
                      {item.nama_usaha}
                    </div>
                    {item.nama_pemilik && (
                      <div className="text-gray-500 text-xs mb-2">oleh {item.nama_pemilik}</div>
                    )}
                    {item.deskripsi && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                        {item.deskripsi}
                      </p>
                    )}
                    {item.alamat && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                        <IconMap />
                        <span className="truncate">{item.alamat}</span>
                      </div>
                    )}

                    {/* Tombol WA */}
                    <div className="mt-auto">
                      {item.no_whatsapp ? (
                        <a
                          href={`https://wa.me/${item.no_whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/30 hover:border-primary text-xs font-bold py-2.5 rounded-xl transition-all duration-200"
                        >
                          <IconWa />
                          Hubungi via WhatsApp
                        </a>
                      ) : (
                        <div className="w-full flex items-center justify-center text-gray-600 text-xs py-2.5 rounded-xl border border-white/5">
                          Belum ada kontak
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer info */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10 text-gray-600 text-xs">
            Menampilkan {filtered.length} dari {umkm.length} UMKM
          </div>
        )}
      </div>
    </div>
  )
}