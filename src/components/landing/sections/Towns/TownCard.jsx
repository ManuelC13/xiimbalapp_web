import { RotateCcw } from 'lucide-react'
import { useState } from 'react'

const FALLBACK_BACKGROUNDS = [
  'bg-linear-to-br from-amber-700 to-amber-900',
  'bg-linear-to-br from-amber-600 to-amber-800',
  'bg-linear-to-br from-amber-900 to-amber-950',
]

export default function TownCard({ town, index, visible = true, flipped, onToggle }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = town.image && !imageFailed
  const fallback = FALLBACK_BACKGROUNDS[index % FALLBACK_BACKGROUNDS.length]
  const staggered = index % 2 === 1 ? 'md:mt-12' : ''

  return (
    <li 
      style={visible ? { transitionDelay: `${Math.min(index, 5) * 100}ms` } : undefined}
      className={`shrink-0 snap-start transition duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} ${staggered}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={flipped}
        aria-label={`${town.name}: ${flipped ? 'ocultar' : 'ver'} descripción`}
        className="group block w-60 cursor-pointer rounded-4xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-950 sm:w-65"
      >
        {/* Movimiento al pasar el cursor */}
        <span
          className={`block transition-transform duration-300 ease-out perspective-distant motion-reduce:transform-none ${
            flipped ? 'group-hover:-translate-y-1' : 'group-hover:-translate-y-2 group-hover:rotate-1'
          }`}
        >
          {/* Giro */}
          <span
            className={`relative block aspect-3/4 transition-transform duration-700 ease-in-out transform-3d motion-reduce:duration-0 ${
              flipped ? 'transform-[rotateY(180deg)]' : ''
            }`}
          >
            {/* Frente: imagen + nombre */}
            <span
              aria-hidden={flipped}
              className={`absolute inset-0 block overflow-hidden rounded-4xl shadow-xl shadow-amber-950/25 backface-hidden ${showImage ? 'bg-amber-900' : fallback}`}
            >
              {showImage && (
                <img
                  src={town.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              )}
              <span className="absolute inset-0 bg-linear-to-t from-amber-950/85 via-amber-950/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-6 text-2xl font-extrabold leading-tight text-white">
                {town.name}
              </span>
            </span>

            {/* Reverso: descripción */}
            <span
              aria-hidden={!flipped}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-4xl border border-amber-600 bg-amber-100 p-6 shadow-xl shadow-amber-950/25 backface-hidden transform-[rotateY(180deg)]"
            >
              <span className="text-2xl font-extrabold leading-tight text-amber-950">{town.name}</span>
              <span className="mt-3 flex-1 overflow-y-auto text-base leading-relaxed text-amber-800">
                {town.description}
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                <RotateCcw className="size-4" aria-hidden />
                Toca para volver
              </span>
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}