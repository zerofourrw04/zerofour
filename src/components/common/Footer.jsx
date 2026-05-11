import { Link } from 'react-router-dom'

// ── SVG Icons ──────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-gray-400 flex-shrink-0">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
)

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-red-400 flex-shrink-0">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// ── Footer ─────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer
      style={{ background: 'linear-gradient(135deg, #021a0e 0%, #041f10 50%, #021408 100%)' }}
      className="border-t border-green-900/40 mt-20 relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-green-900/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-24 bg-green-800/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">

        {/* ── Brand ── */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-3">
            <img
              src="/ikon-zerofour.jpg"
              alt="Ikon Zero Four"
              className="h-10 w-10 object-contain rounded-lg"
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
          <p className="text-gray-300 text-sm leading-relaxed">
            Komunitas pemuda dan warga RW.04 Desa Sindang yang aktif, inovatif, dan selalu bergerak untuk kebaikan bersama.
          </p>
        </div>

        {/* ── Menu ── */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-xs tracking-widest uppercase">Menu</h4>
          <div className="flex flex-col gap-2.5 text-sm">
            {[
              { to: '/',         label: 'Beranda' },
              { to: '/umkm',    label: 'UMKM'    },
              { to: '/berita',  label: 'Berita'  },
              { to: '/galeri',  label: 'Galeri'  },
              { to: '/tentang', label: 'Tentang' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 rounded-full" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Kontak ── */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-xs tracking-widest uppercase">Kontak</h4>
          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 hover:text-green-400 transition-colors"
            >
              <WhatsAppIcon />
              0812-3456-7890
            </a>
            <a
              href="mailto:zerofour.rw04@gmail.com"
              className="flex items-center gap-2.5 hover:text-gray-200 transition-colors"
            >
              <EmailIcon />
              zerofour.rw04@gmail.com
            </a>
            <span className="flex items-center gap-2.5">
              <LocationIcon />
              Desa Sindang, RW.04
            </span>
          </div>
        </div>

        {/* ── Media Sosial ── */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-xs tracking-widest uppercase">Media Sosial</h4>
          <div className="flex gap-3">
            {[
              { href: '#', icon: <FacebookIcon />,  label: 'Facebook',  color: 'hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]' },
              { href: '#', icon: <InstagramIcon />, label: 'Instagram', color: 'hover:border-pink-500 hover:text-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_12px_rgba(236,72,153,0.2)]' },
              { href: '#', icon: <YoutubeIcon />,   label: 'YouTube',   color: 'hover:border-red-500 hover:text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]' },
            ].map(({ href, icon, label, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-white border border-green-800/40 transition-all duration-200 ${color}`}
              >
                {icon}
              </a>
            ))}
          </div>

          <p className="text-gray-400 text-xs mt-6 leading-relaxed">
            Bersama membangun<br />
            <span className="text-primary">RW.04 yang lebih baik.</span>
          </p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-green-900/30 py-4 text-center text-xs text-gray-400 relative z-10">
        © 2025 <span className="text-primary">Zero Four RW.04</span>. All rights reserved.
      </div>
    </footer>
  )
}