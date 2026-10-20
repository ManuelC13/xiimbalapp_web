import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'

// Estructura común del sitio público: navbar + contenido + footer.
export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}