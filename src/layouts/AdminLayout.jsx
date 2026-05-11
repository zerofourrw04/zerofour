import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const menus = [
  { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/berita', label: 'Berita', icon: '📰' },
  { path: '/admin/kegiatan', label: 'Kegiatan', icon: '📅' },
  { path: '/admin/umkm', label: 'UMKM', icon: '🏪' },
  { path: '/admin/galeri', label: 'Galeri', icon: '🖼️' },
  { path: '/admin/pengurus', label: 'Pengurus', icon: '👥' },
  { path: '/admin/profil', label: 'Kelola Profil', icon: '👨🏻‍💼' },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (menu) => {
    if (menu.exact) return location.pathname === menu.path
    return location.pathname.startsWith(menu.path)
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-dark-100 border-r border-white/10 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">Z</div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm">Zero Four</div>
              <div className="text-primary text-xs">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {menus.map((menu) => (
            <Link key={menu.path} to={menu.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm
                ${isActive(menu)
                  ? 'bg-primary text-black font-bold'
                  : 'text-gray-400 hover:bg-dark-300 hover:text-white'}`}>
              <span className="text-base flex-shrink-0">{menu.icon}</span>
              {sidebarOpen && <span>{menu.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-white/10">
          {sidebarOpen && (
            <div className="px-3 py-2 mb-2">
              <div className="text-white text-sm font-semibold truncate">{user?.nama}</div>
              <div className="text-gray-500 text-xs truncate">{user?.email}</div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm">
            <span className="text-base flex-shrink-0">⛔</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-60' : 'ml-16'} transition-all duration-300`}>
        {/* Topbar */}
        <header className="bg-dark-100 border-b border-white/10 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors text-xl">
            ☰
          </button>
          <div className="flex-1" />
          <Link to="/" target="_blank"
            className="text-gray-400 hover:text-primary text-sm transition-colors">
            Lihat Website ↗
          </Link>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}