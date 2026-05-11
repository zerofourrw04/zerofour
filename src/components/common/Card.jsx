/**
 * Card — komponen kartu reusable
 *
 * Props:
 *  - className   : tambahan class Tailwind
 *  - hover       : boolean, aktifkan efek hover border hijau (default true)
 *  - padding     : boolean, aktifkan padding default (default true)
 *  - onClick     : handler klik opsional
 *  - children    : konten kartu
 */
export default function Card({
  className = '',
  hover = true,
  padding = true,
  onClick,
  children,
}) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-dark-200 border border-white/5 rounded-xl overflow-hidden',
        hover ? 'hover:border-primary/30 transition-all duration-200' : '',
        padding ? 'p-4' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/**
 * Card.Image — slot gambar di bagian atas kartu (tanpa padding)
 *
 * Props:
 *  - src         : URL gambar
 *  - alt         : teks alt
 *  - height      : tinggi area gambar (default 'h-40')
 *  - fallback    : emoji/teks yang ditampilkan jika src kosong
 */
Card.Image = function CardImage({
  src,
  alt = '',
  height = 'h-40',
  fallback = '🏪',
}) {
  return (
    <div className={`${height} bg-dark-400 overflow-hidden`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-dark-400 flex items-center justify-center text-3xl">
          {fallback}
        </div>
      )}
    </div>
  )
}

/**
 * Card.Body — area konten dengan padding standar
 */
Card.Body = function CardBody({ className = '', children }) {
  return (
    <div className={`p-3 ${className}`}>
      {children}
    </div>
  )
}