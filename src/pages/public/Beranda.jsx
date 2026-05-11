import HeroSection from '../../components/sections/HeroSection'
import StatsSection from '../../components/sections/StatsSection'
import KegiatanSection from '../../components/sections/KegiatanSection'
import UmkmSection from '../../components/sections/UmkmSection'
import GaleriSection from '../../components/sections/GaleriSection'

export default function Beranda() {
  return (
    <div className="pt-16">
      <HeroSection />
      <StatsSection />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <KegiatanSection />
          <UmkmSection />
          <GaleriSection />
        </div>
      </div>
    </div>
  )
}