import About from '@/components/landing/sections/About'
import Download from '@/components/landing/sections/Download'
import Features from '@/components/landing/sections/Features'
import Towns from '@/components/landing/sections/Towns'
import Hero from '@/components/landing/Hero'
import PublicLayout from '@/layouts/PublicLayout'

export default function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <About />
      <Features />
      <Towns />
      <Download />
    </PublicLayout>
  )
}