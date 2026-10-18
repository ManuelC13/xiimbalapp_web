import Logo from '@/components/landing/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-amber-950/10 bg-amber-50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-10">
        <Logo />
        <p className="text-sm text-amber-800">© {new Date().getFullYear()} XíimbalApp. Turismo cultural en Yucatán.</p>
      </div>
    </footer>
  )
}