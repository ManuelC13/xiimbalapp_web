import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import useHorizontalScroll from '@/hooks/useHorizontalScroll'
import useInView from '@/hooks/useInView'
import TownCard from './TownCard'

const arrowClass =
  'flex size-12 items-center justify-center rounded-full bg-amber-950 text-white transition-opacity hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-30'

// Fila de tarjetas con scroll horizontal (táctil en móvil o con flechas en escritorio)
export default function TownsCarousel({ towns }) {
  const listRef = useRef(null)
  const [openId, setOpenId] = useState(null)
  const { canPrev, canNext, scrollByCard } = useHorizontalScroll(listRef)
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <div ref={ref}>
      <div className="-mx-5 sm:-mx-6 lg:-mx-10 xl:mx-[calc((100%-100vw)/2)]">
        <ul
          ref={listRef}
          aria-label="Pueblos Mágicos"
          className="flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-8 pt-4 scrollbar-none sm:scroll-pl-6 sm:gap-6 sm:px-6 sm:pb-12 sm:pt-6 lg:scroll-pl-10 lg:px-10 [&::-webkit-scrollbar]:hidden *:first:ml-auto *:last:mr-auto"
        >
          {towns.map((town, index) => (
            <TownCard
              key={town.id}
              town={town}
              index={index}
              visible={inView}
              flipped={openId === town.id}
              onToggle={() => setOpenId((current) => (current === town.id ? null : town.id))}
            />
          ))}
        </ul>
      </div>

      {/* Flechas debajo de las tarjetas, centradas (en móvil se desliza con el dedo) */}
      {(canPrev || canNext) && (
        <div className="hidden justify-center gap-4 md:flex">
          <button type="button" onClick={() => scrollByCard(-1)} disabled={!canPrev} className={arrowClass} aria-label="Pueblos anteriores">
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button type="button" onClick={() => scrollByCard(1)} disabled={!canNext} className={arrowClass} aria-label="Pueblos siguientes">
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
