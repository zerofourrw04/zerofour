import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBeritaDetail } from '../../api/beritaApi'
import { getKegiatanDetail } from '../../api/kegiatanApi'
import { getGaleri } from '../../api/galeriApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

export default function BeritaDetail() {
  const { slug }     = useParams()
  const navigate     = useNavigate()
  const isKegiatan   = window.location.pathname.startsWith('/kegiatan')

  const [data, setData]     = useState(null)
  const [fotos, setFotos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)
  const [lightbox, setLightbox] = useState(null) // index foto yang dibuka

  useEffect(() => {
    setLoading(true)
    setError(false)

    const fetchFn = isKegiatan ? getKegiatanDetail : getBeritaDetail

    fetchFn(slug)
      .then(res => {
        const d = res.data?.data ?? res.data
        setData(d)

        // Ambil foto album jika ada id
        if (d?.id) {
          getGaleri({ berita_id: d.id })
            .then(gRes => {
              const result = gRes.data?.data?.data ?? gRes.data?.data ?? gRes.data ?? []
              setFotos(Array.isArray(result) ? result : [])
            })
            .catch(() => {})
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-dark-100 pt-24 flex items-center justify-center">
      <div className="text-gray-500">Memuat...</div>
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen bg-dark-100 pt-24 flex flex-col items-center justify-center gap-4">
      <div className="text-gray-400 text-lg">Konten tidak ditemukan</div>
      <button onClick={() => navigate(-1)}
        className="text-primary hover:underline text-sm">← Kembali</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-100 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <Link to="/berita" className="hover:text-white transition-colors">Berita & Kegiatan</Link>
          <span>/</span>
          <span className="text-gray-300 line-clamp-1">{data.judul}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4">
          {/* Badge tipe & kategori */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full
              ${isKegiatan
                ? 'bg-green-500/20 text-green-400'
                : 'bg-cyan-500/20 text-cyan-400'}`}>
              {isKegiatan ? 'Kegiatan' : 'Berita'}
            </span>
            {data.kategori?.nama && (
              <span className="text-xs px-3 py-1 rounded-full bg-dark-300 text-gray-400">
                {data.kategori.nama}
              </span>
            )}
            {isKegiatan && data.status && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium
                ${data.status === 'akan_datang' ? 'bg-blue-500/20 text-blue-400'
                : data.status === 'berlangsung' ? 'bg-primary/20 text-primary'
                : 'bg-gray-500/20 text-gray-400'}`}>
                {data.status === 'akan_datang' ? 'Akan Datang'
                : data.status === 'berlangsung' ? 'Berlangsung'
                : 'Selesai'}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            {data.judul}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-gray-500 text-sm flex-wrap">
            <span>📅 {data.tanggal}</span>
            {isKegiatan && data.waktu && <span>🕐 {data.waktu}</span>}
            {isKegiatan && data.lokasi && <span>📍 {data.lokasi}</span>}
            {data.admin?.nama && <span>✍️ {data.admin.nama}</span>}
          </div>
        </div>

        {/* Thumbnail */}
        {data.thumbnail && (
          <div className="w-full rounded-2xl overflow-hidden max-h-96">
            <img
              src={`${STORAGE_URL}/${data.thumbnail}`}
              alt={data.judul}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Isi konten */}
        {data.isi && (
          <div
            className="text-gray-300 leading-relaxed text-sm md:text-base prose prose-invert max-w-none
              prose-p:text-gray-300 prose-headings:text-white prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: data.isi }}
          />
        )}

        {/* Album Foto */}
        {fotos.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="text-white font-bold text-lg">Foto Kegiatan</h2>
              <span className="text-gray-500 text-sm">({fotos.length} foto)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fotos.map((foto, idx) => (
                <div
                  key={foto.id}
                  onClick={() => setLightbox(idx)}
                  className="aspect-square rounded-xl overflow-hidden bg-dark-400 cursor-pointer group"
                >
                  <img
                    src={`${STORAGE_URL}/${foto.foto}`}
                    alt={foto.judul || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol kembali */}
        <div>
          <button onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
            ← Kembali
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.max(0, i - 1)) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl px-3 py-1 rounded-xl hover:bg-white/10 transition-colors"
            disabled={lightbox === 0}
          >
            ‹
          </button>

          <img
            src={`${STORAGE_URL}/${fotos[lightbox]?.foto}`}
            alt=""
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />

          <button
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.min(fotos.length - 1, i + 1)) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl px-3 py-1 rounded-xl hover:bg-white/10 transition-colors"
            disabled={lightbox === fotos.length - 1}
          >

          </button>

          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white text-xl w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-4 text-gray-400 text-sm">
            {lightbox + 1} / {fotos.length}
          </div>
        </div>
      )}
    </div>
  )
}