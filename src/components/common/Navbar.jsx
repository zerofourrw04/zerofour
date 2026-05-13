import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// ── Hamburger / Close Icon ──────────────────────────────────
const HamburgerIcon = ({ open }) => (
  <div className="w-5 h-4 flex flex-col justify-between relative">
    <span
      className="block h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
      style={open ? { transform: 'translateY(7px) rotate(45deg)' } : {}}
    />
    <span
      className="block h-0.5 bg-white rounded-full transition-all duration-300"
      style={open ? { opacity: 0, transform: 'scaleX(0)' } : {}}
    />
    <span
      className="block h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
      style={open ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}}
    />
  </div>
)

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Tutup menu saat pindah halaman (skip mount pertama)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    const t = setTimeout(() => setMenuOpen(false), 0)
    return () => clearTimeout(t)
  }, [pathname])

  // Tutup menu saat resize ke desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cegah scroll saat menu mobile terbuka
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = prev }
  }, [menuOpen])

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

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* ── Logo kiri ── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/ikon-zerofour.jpg"
              alt="Ikon Zero Four"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col justify-center">
              <img
                src="/zerofour.jpg"
                alt="Zero Four"
                className="h-4 object-contain object-left"
              />
              <img
                src="/rw04.jpg"
                alt="RW.04"
                className="h-3.5 object-contain object-left mt-0.5"
              />
            </div>
          </Link>

          {/* ── Menu tengah (desktop) ── */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative transition-colors px-3 py-1 rounded-full
                  ${isActive(to)
                    ? 'text-[#00ff88] font-semibold'
                    : 'text-gray-300 hover:text-primary'
                  }`}
                style={isActive(to) ? {
                  outline: '1.5px solid #00ff88',
                  outlineOffset: '2px',
                } : {}}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Kanan: tombol WA (desktop) + hamburger (mobile) ── */}
          <div className="flex items-center gap-3">
            {/* Tombol WA — hanya di desktop */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-primary text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-400 transition-colors"
            >
              <WhatsAppIcon />
              Hubungi Kami
            </a>

            {/* Hamburger — hanya di mobile */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 hover:bg-white/10 transition-colors"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: 'linear-gradient(160deg, #041f10 0%, #021408 100%)', borderLeft: '1px solid rgba(34,197,94,0.15)' }}
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-900/30">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
            <img src="/ikon-zerofour.jpg" alt="Zero Four" className="h-8 w-8 object-contain rounded-md" />
            <span className="text-white text-sm font-semibold tracking-wide">Zero Four</span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-green-900/40 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="px-4 py-5 flex flex-col gap-1">
          {navLinks.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive(to)
                  ? 'bg-green-500/10 text-[#00ff88] border border-green-500/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {isActive(to) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] flex-shrink-0" />
              )}
              {label}
            </Link>
          ))}
        </div>

        {/* Tombol WA di drawer */}
        <div className="px-4 mt-2">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-primary text-black text-sm font-semibold px-4 py-3 rounded-xl hover:bg-green-400 transition-colors"
          >
            <WhatsAppIcon />
            Hubungi Kami
          </a>
        </div>

        {/* Footer drawer */}
        <div className="absolute bottom-6 left-0 right-0 px-5 text-center text-xs text-gray-600">
          © 2025 Zero Four RW.04
        </div>
      </div>
    </>
  )
}
