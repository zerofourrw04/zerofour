const variantMap = {
  green:  { bg: '#22c55e20', text: '#22c55e' },
  blue:   { bg: '#3b82f620', text: '#3b82f6' },
  yellow: { bg: '#f59e0b20', text: '#f59e0b' },
  red:    { bg: '#ef444420', text: '#ef4444' },
  purple: { bg: '#8b5cf620', text: '#8b5cf6' },
  gray:   { bg: '#6b728020', text: '#9ca3af' },
}

const kategoriVariant = {
  'Makanan':    'green',
  'Jasa':       'blue',
  'Kerajinan':  'yellow',
  'Fashion':    'purple',
  'Pertanian':  'green',
  'Santunan':   'green',
  'Pengajian':  'blue',
  '17 Agustus': 'red',
  'Sosial':     'yellow',
  'Olahraga':   'blue',
}

export default function Badge({ label, variant, color }) {
  let bg, text

  if (color) {
    bg   = `${color}20`
    text = color
  } else {
    const key = variant || kategoriVariant[label] || 'gray'
    bg   = variantMap[key]?.bg   || variantMap.gray.bg
    text = variantMap[key]?.text || variantMap.gray.text
  }

  return (
    <span
      style={{ backgroundColor: bg, color: text }}
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block"
    >
      {label}
    </span>
  )
}