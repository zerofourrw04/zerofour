import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBerita, deleteBerita } from '../../api/beritaApi'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

export default function BeritaAdmin() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    getBerita({ tipe: 'berita' })
      .then(res => {
        const result = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
        setData(Array.isArray(result) ? result : [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus berita ini?')) return
    try {
      await deleteBerita(id)
      fetchData()
    } catch {
      alert('Gagal menghapus berita')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Berita</h1>
          <p className="text-gray-500 text-sm">Kelola berita & artikel</p>
        </div>
        <Link to="/admin/berita/tambah"
          className="bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-green-400 transition-all text-sm">
          + Tambah Berita
        </Link>
      </div>

      {/* Table */}
      <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Belum ada berita</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">JUDUL</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">KATEGORI</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">TANGGAL</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">STATUS</th>
                <th className="text-right text-gray-500 text-xs px-5 py-3 font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-dark-300 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-400 overflow-hidden flex-shrink-0">
                        {item.thumbnail
                          ? <img src={`${STORAGE_URL}/${item.thumbnail}`} alt="" className="w-full h-full object-cover"/>
                          : <div className="w-full h-full flex items-center justify-center text-lg">📰</div>
                        }
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium line-clamp-1">{item.judul}</div>
                        <div className="text-gray-500 text-xs">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs bg-dark-400 text-gray-300 px-2 py-1 rounded-lg">
                      {item.kategori?.nama || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">{item.tanggal}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${item.aktif ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'}`}>
                      {item.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/berita/edit/${item.id}`}
                        className="text-xs bg-dark-400 hover:bg-dark-300 text-white px-3 py-1.5 rounded-lg transition-all">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(item.id)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}