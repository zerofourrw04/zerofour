import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBerita } from '../../api/beritaApi'
import { getUmkm } from '../../api/umkmApi'
import { getGaleri } from '../../api/galeriApi'
import { getPengurus } from '../../api/pengurusApi'

export default function Dashboard() {
  const [stats, setStats] = useState({ berita: 0, umkm: 0, galeri: 0, pengurus: 0 })

  useEffect(() => {
    Promise.allSettled([
      getBerita({ tipe: 'berita' }),
      getUmkm(),
      getGaleri(),
      getPengurus(),
    ]).then(([b, u, g, p]) => {
      setStats({
        berita: b.value?.data?.total || 0,
        umkm: u.value?.data?.total || 0,
        galeri: g.value?.data?.total || 0,
        pengurus: p.value?.data?.total || 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Berita', value: stats.berita, icon: '📰', path: '/admin/berita', color: '#3b82f6' },
    { label: 'Total UMKM', value: stats.umkm, icon: '🏪', path: '/admin/umkm', color: '#22c55e' },
    { label: 'Total Galeri', value: stats.galeri, icon: '🖼️', path: '/admin/galeri', color: '#f59e0b' },
    { label: 'Total Pengurus', value: stats.pengurus, icon: '👥', path: '/admin/pengurus', color: '#8b5cf6' },
  ]

  const shortcuts = [
    { label: 'Tambah Berita', path: '/admin/berita/tambah', icon: '📰' },
    { label: 'Tambah Kegiatan', path: '/admin/kegiatan/tambah', icon: '📅' },
    { label: 'Tambah UMKM', path: '/admin/umkm/tambah', icon: '🏪' },
    { label: 'Upload Galeri', path: '/admin/galeri/tambah', icon: '🖼️' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di panel admin Zero Four RW.04</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link to={c.path} key={c.label}
            className="bg-dark-200 border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
              style={{ backgroundColor: `${c.color}20` }}>
              {c.icon}
            </div>
            <div className="text-3xl font-extrabold text-white">{c.value}</div>
            <div className="text-gray-500 text-sm mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      </div>
  )
}