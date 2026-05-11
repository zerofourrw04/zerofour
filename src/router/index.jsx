import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
// ── Public pages ──────────────────────────────────────────
import BeritaDetail    from '../pages/public/BeritaDetail'
import Beranda         from '../pages/public/Beranda'
import UmkmPage        from '../pages/public/UmkmPage'
import BeritaPage      from '../pages/public/BeritaPage'
import GaleriPage      from '../pages/public/GaleriPage'
import TentangPage     from '../pages/public/TentangPage'
import HalamanPengurus from '../pages/public/HalamanPengurus'   // ← TAMBAH INI
// ── Auth ──────────────────────────────────────────────────
import Login from '../pages/Login'
// ── Admin pages ───────────────────────────────────────────
import Dashboard     from '../pages/admin/Dashboard'
import BeritaAdmin   from '../pages/admin/BeritaAdmin'
import BeritaForm    from '../pages/admin/BeritaForm'
import UmkmAdmin     from '../pages/admin/UmkmAdmin'
import GaleriAdmin   from '../pages/admin/GaleriAdmin'
import PengurusAdmin from '../pages/admin/PengurusAdmin'
import ProfilAdmin   from '../pages/admin/ProfilAdmin'
import KegiatanAdmin from '../pages/admin/KegiatanAdmin'

const router = createBrowserRouter([
  // ── Public ────────────────────────────────────────────
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true,            element: <Beranda />         },
      { path: 'umkm',           element: <UmkmPage />        },
      { path: 'berita',         element: <BeritaPage />      },
      { path: 'berita/:slug',   element: <BeritaDetail />    },
      { path: 'kegiatan/:slug', element: <BeritaDetail />    },
      { path: 'galeri',         element: <GaleriPage />      },
      { path: 'tentang',        element: <TentangPage />     },
      { path: 'pengurus',       element: <HalamanPengurus /> }, // ← TAMBAH INI
    ],
  },
  // ── Auth ──────────────────────────────────────────────
  { path: '/login', element: <Login /> },
  // ── Admin ─────────────────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'berita',          element: <BeritaAdmin /> },
      { path: 'berita/tambah',   element: <BeritaForm />  },
      { path: 'berita/edit/:id', element: <BeritaForm />  },
      { path: 'umkm',            element: <UmkmAdmin />    },
      { path: 'galeri',          element: <GaleriAdmin />  },
      { path: 'kegiatan',        element: <KegiatanAdmin /> },
      { path: 'pengurus',        element: <PengurusAdmin /> },
      { path: 'profil',          element: <ProfilAdmin />  },
    ],
  },
])

export default router