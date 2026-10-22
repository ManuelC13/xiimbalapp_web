import { useCallback, useEffect, useState } from 'react'

const GAP = 24 // debe coincidir con el gap del carrusel (gap-6)

// Controla un contenedor con scroll horizontal: indica si se puede avanzar/retroceder
// y permite desplazarse de tarjeta en tarjeta.
export default function useHorizontalScroll(ref) {
  const [state, setState] = useState({ canPrev: false, canNext: false })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setState({
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }, [ref])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [ref, update])

  const scrollByCard = useCallback(
    (direction) => {
      const el = ref.current
      if (!el) return
      const card = el.firstElementChild
      const step = card ? card.getBoundingClientRect().width + GAP : 280
      el.scrollBy({ left: direction * step, behavior: 'smooth' })
    },
    [ref],
  )

  return { ...state, scrollByCard }
}