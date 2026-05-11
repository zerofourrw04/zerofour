import { useState, useEffect, useCallback } from 'react'
import { getGaleri } from '../../api/galeriApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const IconCamera    = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
const IconX         = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconBack      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
const IconChevLeft  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
const IconChevRight = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
const IconImages    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const IconSearch    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

function groupByJudul(data) {
  const map = {}
  data.forEach((item) => {
    const key = item.judul || '(Tanpa Album)'
    if (!map[key]) map[key] = []
    map[key].push(item)
  })
  return map
}

export default function GaleriPage() {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')

  const [view, setView]               = useState('albums')
  const [activeAlbum, setActiveAlbum] = useState(null)

  const [lightbox, setLightbox]       = useState(null)
  const [imgLoaded, setImgLoaded]     = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    getGaleri({ limit: 100 })
      .then((res) => setData(res.data?.data || res.data || []))
      .catch(() => setError('Gagal memuat galeri.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const albums      = groupByJudul(data)
  const albumNames  = Object.keys(albums)
  const activePhotos = activeAlbum ? (albums[activeAlbum] || []) : []

  // Filter album berdasarkan search
  const filteredAlbumNames = albumNames.filter((nama) =>
    nama.toLowerCase().includes(search.toLowerCase())
  )

  // Total foto keseluruhan
  const totalFoto = data.length

  useEffect(() => {
    if (lightbox === null) return
    const handle = (e) => {
      if (e.key === 'Escape')     setLightbox(null)
      if (e.key === 'ArrowRight') { setImgLoaded(false); setLightbox((i) => (i + 1) % activePhotos.length) }
      if (e.key === 'ArrowLeft')  { setImgLoaded(false); setLightbox((i) => (i - 1 + activePhotos.length) % activePhotos.length) }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [lightbox, activePhotos.length])

  const activePhoto = lightbox !== null ? activePhotos[lightbox] : null

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16">

      {/* ── Hero Section ── */}
      {view === 'albums' && (
        <div className="relative overflow-hidden border-b border-white/5 mb-10 pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#16a34a22_0%,_transparent_60%)]" />
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Desa Sindang</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3 leading-tight">
              Galeri <span className="text-primary">Kegiatan RW.04</span>
            </h1>
            <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
              Kumpulan album foto kegiatan warga RW.04 Desa Sindang.
            <p>Abadikan setiap momen bersama.</p>
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-8">
              <div>
                <div className="text-2xl font-black text-white">{albumNames.length}</div>
                <div className="text-gray-500 text-xs mt-0.5">Total Album</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-2xl font-black text-white">{totalFoto}</div>
                <div className="text-gray-500 text-xs mt-0.5">Total Foto</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-2xl font-black text-primary">
                  {data.filter((f) => f.tampil_beranda).length}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">Di Beranda</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Header saat view photos ── */}
        {view === 'photos' && (
          <div className="pt-24 mb-8">
            <button
              onClick={() => { setView('albums'); setActiveAlbum(null); setLightbox(null) }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-primary text-sm transition-colors mb-4"
            >
              <IconBack /> Kembali ke Album
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h1 className="text-3xl font-bold text-white">{activeAlbum}</h1>
            </div>
            <p className="text-gray-500 text-sm ml-3">{activePhotos.length} foto dalam album ini</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-5 py-4 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchData} className="underline hover:text-red-300">Coba lagi</button>
          </div>
        )}

        {/* ── Search (hanya di view albums) ── */}
        {view === 'albums' && (
          <div className="mb-8">
            <div className="relative max-w-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Cari nama album..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        )}

        {/* ── VIEW: Album ── */}
        {view === 'albums' && (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filteredAlbumNames.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📷</div>
              <div className="text-white font-semibold mb-1">
                {search ? 'Album tidak ditemukan' : 'Belum ada foto kegiatan'}
              </div>
              <div className="text-gray-500 text-sm">
                {search ? 'Coba kata kunci lain' : 'Foto kegiatan akan tampil di sini'}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAlbumNames.map((nama) => {
                  const fotos = albums[nama]
                  const cover = fotos[0]?.foto ? `${STORAGE_URL}/${fotos[0].foto}` : null
                  const adaBeranda = fotos.some((f) => f.tampil_beranda)

                  return (
                    <button
                      key={nama}
                      onClick={() => { setActiveAlbum(nama); setView('photos') }}
                      className="text-left group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(22,163,74,0.08)] flex flex-col focus:outline-none"
                    >
                      {/* Cover foto */}
                      <div className="relative h-44 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                        {cover ? (
                          <img
                            src={cover}
                            alt={nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gradient-to-br from-primary/5 to-[#1a1a1a]">
                            <IconCamera />
                          </div>
                        )}

                        {/* Badge beranda */}
                        {adaBeranda && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary/90 text-black text-xs font-bold px-2 py-0.5 rounded-lg">
                              ⭐ Beranda
                            </span>
                          </div>
                        )}

                        {/* Badge jumlah foto */}
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                          <IconImages /> {fotos.length} foto
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                            Lihat Foto
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="font-bold text-white text-sm leading-tight mb-1 line-clamp-1">{nama}</div>
                        <div className="text-gray-500 text-xs">{fotos.length} foto</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Footer info */}
              {!loading && filteredAlbumNames.length > 0 && (
                <div className="text-center mt-10 text-gray-600 text-xs">
                  Menampilkan {filteredAlbumNames.length} dari {albumNames.length} album
                </div>
              )}
            </>
          )
        )}

        {/* ── VIEW: Foto dalam Album ── */}
        {view === 'photos' && (
          activePhotos.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📷</div>
              <div className="text-white font-semibold mb-1">Belum ada foto</div>
              <div className="text-gray-500 text-sm">Foto belum ditambahkan ke album ini</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activePhotos.map((foto, idx) => (
                <button
                  key={foto.id}
                  onClick={() => { setLightbox(idx); setImgLoaded(false) }}
                  className="text-left group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(22,163,74,0.08)] flex flex-col focus:outline-none"
                >
                  <div className="relative h-48 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    {foto.foto ? (
                      <img
                        src={`${STORAGE_URL}/${foto.foto}`}
                        alt={foto.keterangan}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <IconCamera />
                      </div>
                    )}
                    {foto.tampil_beranda && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary/90 text-black text-xs font-bold px-2 py-0.5 rounded-lg">
                          ⭐ Beranda
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                        Perbesar
                      </span>
                    </div>
                  </div>
                  {foto.keterangan && (
                    <div className="p-4 flex-1">
                      <div className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{foto.keterangan}</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Lightbox ── */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-red-500/80 transition-colors"
            >
              <IconX />
            </button>

            <div className="relative bg-[#1a1a1a]" style={{ minHeight: 280, maxHeight: '60vh' }}>
              {!imgLoaded && <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />}
              <img
                key={activePhoto.id}
                src={`${STORAGE_URL}/${activePhoto.foto}`}
                alt={activePhoto.keterangan}
                onLoad={() => setImgLoaded(true)}
                className={`w-full object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ maxHeight: '60vh' }}
              />
              {activePhotos.length > 1 && (
                <>
                  <button
                    onClick={() => { setImgLoaded(false); setLightbox((i) => (i - 1 + activePhotos.length) % activePhotos.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2.5 hover:bg-primary/80 hover:text-black transition-all"
                  >
                    <IconChevLeft />
                  </button>
                  <button
                    onClick={() => { setImgLoaded(false); setLightbox((i) => (i + 1) % activePhotos.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2.5 hover:bg-primary/80 hover:text-black transition-all"
                  >
                    <IconChevRight />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                {lightbox + 1} / {activePhotos.length}
              </div>
            </div>

            <div className="px-6 py-4">
              <h2 className="text-white font-bold text-lg">{activeAlbum}</h2>
              {activePhoto.keterangan ? (
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{activePhoto.keterangan}</p>
              ) : (
                <p className="text-gray-600 text-sm mt-1 italic">Tidak ada keterangan.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}