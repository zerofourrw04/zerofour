import { useState, useEffect, useRef } from 'react'
import { getUmkm, createUmkm, updateUmkm, deleteUmkm } from '../../api/umkmApi'
import { getKategoriUmkm } from '../../api/kategoriUmkmApi'
import api from '../../api/axios'

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
const IconX      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconWa     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>

const emptyForm = {
  nama_usaha: '', nama_pemilik: '', kategori_umkm_id: '',
  deskripsi: '', foto: '', no_whatsapp: '', alamat: '',
  tampil_beranda: false, aktif: true,
}

const fotoUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}

const fetchAllData = async () => {
  const [umkmRes, katRes] = await Promise.all([
    getUmkm({ limit: 100 }),
    getKategoriUmkm(),
  ])
  const umkmData = umkmRes.data?.data ?? umkmRes.data ?? []
  const katData  = katRes.data?.data  ?? katRes.data  ?? []
  return {
    umkm:     Array.isArray(umkmData) ? umkmData : umkmData.data ?? [],
    kategori: Array.isArray(katData)  ? katData  : [],
  }
}

export default function UmkmAdmin() {
  const [data, setData]               = useState([])
  const [kategori, setKategori]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [editItem, setEditItem]       = useState(null)
  const [form, setForm]               = useState(emptyForm)
  const [saving, setSaving]           = useState(false)
  const [previewFoto, setPreviewFoto] = useState(null)
  const [fotoFile, setFotoFile]       = useState(null)   // ← file object, belum diupload
  const [error, setError]             = useState('')
  const fileRef = useRef()

  const fetchData = async () => {
    setLoading(true)
    try {
      const { umkm, kategori } = await fetchAllData()
      setData(umkm)
      setKategori(kategori)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    let cancelled = false
    fetchAllData()
      .then(({ umkm, kategori }) => {
        if (cancelled) return
        setData(umkm)
        setKategori(kategori)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const openTambah = () => {
    setEditItem(null)
    setForm(emptyForm)
    setPreviewFoto(null)
    setFotoFile(null)       // ← reset file
    setError('')
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setFotoFile(null)       // ← reset file lama
    setForm({
      nama_usaha:       item.nama_usaha       || '',
      nama_pemilik:     item.nama_pemilik     || '',
      kategori_umkm_id: item.kategori_umkm_id || '',
      deskripsi:        item.deskripsi        || '',
      foto:             item.foto             || '',
      no_whatsapp:      item.no_whatsapp      || '',
      alamat:           item.alamat           || '',
      tampil_beranda:   !!item.tampil_beranda,
      aktif:            item.aktif !== false,
    })
    setPreviewFoto(fotoUrl(item.foto))
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setPreviewFoto(null)
    setFotoFile(null)       // ← reset file saat tutup
    setError('')
  }

  // ← Hanya simpan file & preview, TIDAK upload dulu
  const handleUploadFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFotoFile(file)
    setPreviewFoto(URL.createObjectURL(file))
  }

  const hapusFoto = () => {
    setPreviewFoto(null)
    setFotoFile(null)
    setForm((f) => ({ ...f, foto: '' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  // ← Upload + Simpan dilakukan sekaligus, dijamin berurutan
 const handleSimpan = async () => {
  if (!form.nama_usaha.trim()) { setError('Nama usaha wajib diisi.'); return }
  setSaving(true)
  setError('')
  try {
    let fotoPath = form.foto

    if (fotoFile) {
      const fd = new FormData()
      fd.append('file', fotoFile)
      const res = await api.post('/upload', fd)
      console.log('FULL RESPONSE:', res.data)  // ← tambah ini
      fotoPath = res.data.path
      console.log('FOTO PATH:', fotoPath)       // ← dan ini
    }

    const payload = { ...form, foto: fotoPath }
    console.log('PAYLOAD DIKIRIM:', payload)    // ← dan ini

    if (editItem) {
      await updateUmkm(editItem.id, payload)
    } else {
      await createUmkm(payload)
    }
    closeModal()
    await fetchData()
  } catch (err) {
    setError(err.response?.data?.message || 'Gagal menyimpan data.')
  } finally {
    setSaving(false)
  }
}

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus UMKM ini?')) return
    try { await deleteUmkm(id); await fetchData() }
    catch { alert('Gagal menghapus UMKM.') }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">UMKM</h1>
          <p className="text-gray-500 text-sm">Kelola data UMKM warga RW.04</p>
        </div>
        <button onClick={openTambah}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-green-400 transition-all text-sm">
          <IconPlus /> Tambah UMKM
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Belum ada data UMKM</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium">NAMA USAHA</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">KATEGORI</th>
                <th className="text-left text-gray-500 text-xs px-5 py-3 font-medium hidden md:table-cell">NO. WA</th>
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
                        {item.foto
                          ? <img src={fotoUrl(item.foto)} alt="" className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display='none' }}/>
                          : <div className="w-full h-full flex items-center justify-center text-lg">🏪</div>
                        }
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{item.nama_usaha}</div>
                        <div className="text-gray-500 text-xs">{item.nama_pemilik || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs bg-dark-400 text-gray-300 px-2 py-1 rounded-lg">
                      {item.kategori?.nama || item.kategori_umkm?.nama || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {item.no_whatsapp
                      ? <a href={`https://wa.me/${item.no_whatsapp}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-green-400 text-xs hover:underline">
                          <IconWa /> {item.no_whatsapp}
                        </a>
                      : <span className="text-gray-600 text-xs">-</span>
                    }
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit
                        ${item.aktif ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'}`}>
                        {item.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                      {item.tampil_beranda && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium w-fit bg-blue-500/20 text-blue-400">
                          Beranda
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 text-xs bg-dark-400 hover:bg-dark-300 text-white px-3 py-1.5 rounded-lg transition-all">
                        <IconEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all">
                        <IconTrash /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-100 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-dark-100 z-10">
              <h2 className="text-white font-bold text-lg">{editItem ? 'Edit UMKM' : 'Tambah UMKM'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><IconX /></button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              {/* Upload Foto */}
              <div>
                <label className="block text-gray-400 text-xs mb-2 font-medium">FOTO PRODUK / USAHA</label>
                {previewFoto ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-dark-400">
                    <img src={previewFoto} alt="preview" className="w-full h-full object-cover"/>
                    <button onClick={hapusFoto}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                      <IconX />
                    </button>
                    {/* Indikator file siap diupload */}
                    {fotoFile && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                        📎 {fotoFile.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary/50 hover:text-primary transition-all">
                    <IconUpload />
                    <span className="text-sm">Klik untuk upload foto</span>
                    <span className="text-xs">JPG, PNG, WEBP — maks 2MB</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUploadFoto}/>
              </div>

              {/* Nama Usaha */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">NAMA USAHA <span className="text-red-400">*</span></label>
                <input type="text" value={form.nama_usaha}
                  onChange={(e) => setForm({ ...form, nama_usaha: e.target.value })}
                  placeholder="Contoh: Dapur Bu Siti"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"/>
              </div>

              {/* Nama Pemilik */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">NAMA PEMILIK</label>
                <input type="text" value={form.nama_pemilik}
                  onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })}
                  placeholder="Nama pemilik usaha"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"/>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">KATEGORI</label>
                <select value={form.kategori_umkm_id}
                  onChange={(e) => setForm({ ...form, kategori_umkm_id: e.target.value })}
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors">
                  <option value="">-- Pilih Kategori --</option>
                  {kategori.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>

              {/* No WA */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">NO. WHATSAPP</label>
                <input type="text" value={form.no_whatsapp}
                  onChange={(e) => setForm({ ...form, no_whatsapp: e.target.value })}
                  placeholder="Contoh: 6281234567890"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"/>
                <p className="text-gray-600 text-xs mt-1">Format: 628xxx (tanpa + dan spasi)</p>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">ALAMAT</label>
                <input type="text" value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  placeholder="Alamat lengkap usaha"
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"/>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">DESKRIPSI</label>
                <textarea value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Deskripsi singkat usaha..." rows={3}
                  className="w-full bg-dark-300 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"/>
              </div>

              {/* Toggle */}
              <div className="flex flex-col gap-3">
                {[
                  { key: 'tampil_beranda', label: 'Tampil di Beranda', desc: 'Tampilkan di section UMKM Unggulan' },
                  { key: 'aktif',          label: 'Status Aktif',      desc: 'UMKM akan tampil di halaman publik' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">{label}</div>
                      <div className="text-gray-500 text-xs">{desc}</div>
                    </div>
                    <div onClick={() => setForm({ ...form, [key]: !form[key] })}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form[key] ? 'bg-primary' : 'bg-dark-400'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex gap-3 sticky bottom-0 bg-dark-100">
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
                Batal
              </button>
              <button onClick={handleSimpan} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah UMKM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}