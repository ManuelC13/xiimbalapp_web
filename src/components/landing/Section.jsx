// Contenedor común de las secciones para tener mismo ancho, espaciado y desplazamiento al navegar con el menú
export default function Section({ id, title, subtitle, className = '', children }) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-4xl font-extrabold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-amber-800">{subtitle}</p>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  )
}