import Reveal from '../ui/Reveal'

// Contenedor común de las secciones: mismo ancho, espaciado y desplazamiento al navegar con el menú.
export default function Section({ id, title, subtitle, align = 'left', reveal = false, className = '', children }) {
  const centered = align === 'center'
  const Header = reveal ? Reveal : 'div'

  return (
    <section id={id} className={`relative scroll-mt-20 py-14 sm:py-20 lg:py-28 ${className}`}>
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {title && (
          <Header className={centered ? 'mx-auto max-w-3xl text-center' : ''}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
            {subtitle && (
              <p className={`mt-3 max-w-2xl text-base text-amber-800 sm:mt-4 sm:text-xl ${centered ? 'mx-auto' : ''}`}>
                {subtitle}
              </p>
            )}
          </Header>
        )}
        {children && <div className={title ? 'mt-10 sm:mt-14' : ''}>{children}</div>}
      </div>
    </section>
  )
}
