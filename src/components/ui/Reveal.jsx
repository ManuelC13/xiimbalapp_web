import useInView from '@/hooks/useInView'

// En móvil siempre entra desde abajo, en escritorio puede entrar desde los lados
const HIDDEN = {
  up: 'opacity-0 translate-y-10',
  left: 'opacity-0 translate-y-10 lg:translate-y-0 lg:-translate-x-12',
  right: 'opacity-0 translate-y-10 lg:translate-y-0 lg:translate-x-12',
}
const VISIBLE = 'opacity-100 translate-y-0 lg:translate-x-0'

export default function Reveal({ as: Tag = 'div', direction = 'up', delay = 0, className = '', children, ...props }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      style={inView && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition duration-700 ease-out ${inView ? VISIBLE : HIDDEN[direction]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}