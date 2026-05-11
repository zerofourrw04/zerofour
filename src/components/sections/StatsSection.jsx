// SVG icon inline — tidak perlu install library
const IconPeople = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const IconStore = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1-5h16l1 5"/>
    <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
    <path d="M5 20v-9"/>
    <path d="M19 20v-9"/>
    <rect x="9" y="14" width="6" height="6" rx="1"/>
    <path d="M3 20h18"/>
  </svg>
)

const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
  </svg>
)

const IconHeart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const stats = [
  {
    icon: <IconPeople />,
    value: '120+',
    label: 'Kepala Keluarga',
    desc: 'Bersama membangun lingkungan',
  },
  {
    icon: <IconStore />,
    value: '35+',
    label: 'UMKM Aktif',
    desc: 'Produk & jasa lokal unggulan',
  },
  {
    icon: <IconCalendar />,
    value: '25+',
    label: 'Kegiatan / Tahun',
    desc: 'Rutin & terjadwal setiap tahun',
  },
  {
    icon: <IconHeart />,
    value: '100%',
    label: 'Gotong Royong',
    desc: 'Kebersamaan adalah kunci',
  },
]

export default function StatsSection() {
  return (
    <section className="bg-dark-100 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-4 md:px-6 py-5">
              {/* Icon box */}
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                {s.icon}
              </div>
              {/* Teks */}
              <div>
                <div className="text-2xl font-extrabold text-white leading-none">{s.value}</div>
                <div className="text-primary text-sm font-semibold mt-0.5">{s.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}