import { Link } from 'react-router-dom'

// Icon SVG inline kecil agar tidak perlu library tambahan
const IconFacebook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
)
const IconYoutube = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42A2.78 2.78 0 0 0 20.59 4.46C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const IconWhatsapp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)
const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-500">

      {/* ── Background foto kanan ── */}
      {/*
        Taruh foto grup pemuda RW.04 di: public/hero-bg.jpg
        Foto akan muncul di sisi kanan dengan overlay gradient dari kiri
      */}
      <div className="absolute inset-0 z-0">
        {/* Overlay gradient: kiri gelap → kanan transparan */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <img
          src="/hero-bg.jpg"
          alt="Warga RW.04 Zero Four"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Jika foto belum ada, sembunyikan dan pakai gradient fallback
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* ── Hexagon pattern kiri ── */}
      <div className="absolute left-0 top-0 w-72 h-full opacity-[0.07] z-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon
                points="30,2 58,16 58,36 30,50 2,36 2,16"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      </div>

      {/* ── Glow hijau bawah kiri ── */}
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[80px] z-0 pointer-events-none" />

      {/* ── Konten utama ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="max-w-lg">

          {/* Label atas */}
          <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
            Pemuda Pemudi Zero Four
          </p>

          {/* Judul */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-2">
            RW.04 
            <br />
            ZERO FOUR
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            Bersatu, Maju,{' '}
            <span className="text-primary">Sejahtera.</span>
          </h2>

          {/* Deskripsi */}
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            Komunitas modern yang harmonis, inovatif, dan berdaya saing
            melalui kebersamaan warga dan dukungan UMKM lokal.
          </p>

          {/* Tombol CTA */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              to="/umkm"
              className="inline-flex items-center gap-2 bg-primary text-black text-sm font-bold px-6 py-3 rounded-lg hover:bg-green-400 active:scale-95 transition-all"
            >
              Jelajahi UMKM
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all"
            >
              Lihat Kegiatan
            </Link>
          </div>

          {/* Sosmed */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 text-sm">Temukan kami di</span>
            {[
              { href: '#', icon: <IconFacebook />, label: 'Facebook' },
              { href: '#', icon: <IconInstagram />, label: 'Instagram' },
              { href: '#', icon: <IconYoutube />, label: 'YouTube' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Badge lokasi pojok kanan bawah ── */}
        <div className="absolute bottom-8 right-4 md:right-8 flex items-center gap-2.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5">
          <span className="text-primary">
            <IconMapPin />
          </span>
          <div>
            <div className="text-white text-sm font-semibold leading-tight">Desa Sindang</div>
            <div className="text-gray-400 text-xs">RW.04</div>
          </div>
        </div>
      </div>
    </section>
  )
}