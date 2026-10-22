import { useEffect, useRef, useState } from 'react'

// true cuando el elemento referenciado entra en pantalla al hacer scroll (solo la primera vez).
// Si el usuario prefiere menos movimiento o el navegador no soporta IntersectionObserver, devuelve true de inmediato.
export default function useInView({ threshold = 0.25, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!element || reduceMotion || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}