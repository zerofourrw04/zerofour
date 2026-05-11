import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUmkm } from '../../api/umkmApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const fotoUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}

const fallbackEmoji = {
  Makanan: '🍱', Kuliner: '🍜', Jasa: '✂️', Kerajinan: '🧺',
  Fashion: '👗', Pertanian: '🌾', Teknologi: '💻', Lainnya: '🏪',
}

const IconWa = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

export default function UmkmSection() {
  const [umkm, setUmkm]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUmkm({ limit: 4, tampil_beranda: 1 })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? []
        setUmkm(Array.isArray(data) ? data : data.data ?? [])
      })
      .catch(() => setUmkm([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="font-bold text-white text-lg">UMKM Unggulan</h3>
        </div>
        <Link to="/umkm" className="text-primary text-sm hover:underline flex items-center gap-1">
          Lihat Semua ›
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl h-64 animate-pulse" />
            ))
          : umkm.length === 0
          ? (
            <div className="col-span-4 py-12 text-center text-gray-600 text-sm">
              Belum ada UMKM unggulan
            </div>
          )
          : umkm.map((item) => {
              const kategoriNama = item.kategori?.nama || item.kategori_umkm?.nama || 'Lainnya'
              const emoji        = fallbackEmoji[kategoriNama] || '🏪'
              const foto         = fotoUrl(item.foto)

              return (
                <div key={item.id}
                  className="group bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col">

                  {/* Foto */}
                  <div className="relative h-36 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
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
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ display: foto ? 'none' : 'flex' }}
                    >
                      {emoji}
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 backdrop-blur-sm text-primary text-xs font-semibold px-2 py-0.5 rounded-md border border-primary/20">
                        {kategoriNama}
                      </span>
                    </div>
                  </div>

                  {/* Konten */}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="font-bold text-white text-sm leading-tight truncate">
                      {item.nama_usaha}
                    </div>
                    {item.nama_pemilik && (
                      <div className="text-gray-500 text-xs mt-0.5 truncate">
                        {item.nama_pemilik}
                      </div>
                    )}
                    {item.deskripsi && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-1.5">
                        {item.deskripsi}
                      </p>
                    )}

                    <div className="mt-auto pt-3">
                      {item.no_whatsapp ? (
                        <a
                          href={`https://wa.me/${item.no_whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/20 hover:border-primary text-xs font-bold py-2 rounded-lg transition-all duration-200"
                        >
                          <IconWa />
                          Lihat Detail
                        </a>
                      ) : (
                        <Link
                          to="/umkm"
                          className="w-full flex items-center justify-center text-gray-500 hover:text-white text-xs py-2 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                        >
                          Lihat Detail
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}