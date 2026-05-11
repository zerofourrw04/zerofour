import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/',        label: 'Beranda' },
    { to: '/umkm',    label: 'UMKM'   },
    { to: '/berita',  label: 'Berita'  },
    { to: '/galeri',  label: 'Galeri'  },
    { to: '/tentang', label: 'Tentang' },
  ]

  const isActive = (to) => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <img src="/ikon-zerofour.jpg" alt="Ikon Zero Four" className="h-10 w-10 object-contain" />
          <div className="flex flex-col justify-center">
            <img src="/zerofour.jpg" alt="Zero Four" className="h-4 object-contain object-left" />
            <img src="/rw04.jpg" alt="RW.04" className="h-3.5 object-contain object-left mt-0.5" />
          </div>
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`transition-colors px-3 py-1 rounded-full ${
                isActive(to)
                  ? 'text-[#00ff88] font-semibold'
                  : 'text-gray-300 hover:text-primary'
              }`}
              style={isActive(to) ? { outline: '1.5px solid #00ff88', outlineOffset: '2px' } : {}}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-3">
          
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-primary text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-400 transition-colors"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">Hubungi Kami</span>
          </a>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur border-t border-white/10 px-4 py-4 flex flex-col gap-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
          
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
            className="mt-2 flex items-center justify-center gap-2 bg-primary text-black text-sm font-semibold px-4 py-3 rounded-xl hover:bg-green-400 transition-colors"
          >
            <WhatsAppIcon />
            Hubungi Kami
          </a>
        </div>
      )}
    </nav>
  )
}
