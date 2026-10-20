// Contenedor común de las secciones: mismo ancho, espaciado y desplazamiento al navegar con el menú.
export default function Section({ id, title, subtitle, align = 'left', className = '', children }) {
  const centered = align === 'center'

  return (
    <section id={id} className={`scroll-mt-20 py-20 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {title && (
          <div className={centered ? 'mx-auto max-w-3xl text-center' : ''}>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
            {subtitle && <p className={`mt-4 max-w-2xl text-lg text-amber-800 sm:text-xl ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
          </div>
        )}
        {children && <div className={title ? 'mt-14' : ''}>{children}</div>}
      </div>
    </section>
  )
}