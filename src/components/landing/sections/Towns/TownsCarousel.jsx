import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import useHorizontalScroll from '@/hooks/useHorizontalScroll'
import TownCard from './TownCard'

const arrowClass =
  'flex size-12 items-center justify-center rounded-full bg-amber-950 text-white transition-opacity hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-30'

// Fila de tarjetas con scroll horizontal (táctil en móvil o con flechas en escritorio)
export default function TownsCarousel({ towns }) {
  const listRef = useRef(null)
  const [openId, setOpenId] = useState(null)
  const { canPrev, canNext, scrollByCard } = useHorizontalScroll(listRef)

  return (
    <div>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <ul
          ref={listRef}
          aria-label="Pueblos Mágicos"
          className="flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto px-6 pb-12 pt-6 scrollbar-none lg:scroll-pl-10 lg:px-10 [&::-webkit-scrollbar]:hidden *:first:ml-auto *:last:mr-auto"
        >
          {towns.map((town, index) => (
            <TownCard
              key={town.id}
              town={town}
              index={index}
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