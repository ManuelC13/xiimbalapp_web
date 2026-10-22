import About from '@/components/landing/sections/About'
import Download from '@/components/landing/sections/Download'
import Features from '@/components/landing/sections/Features/Features'
import Towns from '@/components/landing/sections/Towns/Towns'
import Hero from '@/components/landing/sections/Hero/Hero'
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