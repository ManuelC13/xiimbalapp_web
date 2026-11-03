import { RotateCcw } from 'lucide-react'
import { useState } from 'react'

const FALLBACK_BACKGROUNDS = [
  'bg-linear-to-br from-amber-700 to-amber-900',
  'bg-linear-to-br from-amber-600 to-amber-800',
  'bg-linear-to-br from-amber-900 to-amber-950',
]

const TILT_CLASSES = [
  'md:-rotate-1',
  'md:rotate-1 md:mt-12',
  'md:-rotate-[0.75deg]',
  'md:rotate-[1.25deg] md:mt-12',
]

export default function TownCard({ town, index, visible = true, flipped, onToggle }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [prevFlipped, setPrevFlipped] = useState(flipped)
  const showImage = town.image && !imageFailed
  const fallback = FALLBACK_BACKGROUNDS[index % FALLBACK_BACKGROUNDS.length]
  const tilt = TILT_CLASSES[index % TILT_CLASSES.length]

  if (prevFlipped !== flipped) {
    setPrevFlipped(flipped)
    setIsFlipping(true)
  }

  return (
    <li 
      style={visible ? { transitionDelay: `${Math.min(index, 5) * 100}ms` } : undefined}
      className={`shrink-0 snap-center transition duration-700 ease-out sm:snap-start ${visible ? 'opacity-100' : 'translate-y-12 opacity-0'} ${tilt}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={flipped}
        aria-label={`${town.name}: ${flipped ? 'ocultar' : 'ver'} descripción`}
        className="group block w-64 cursor-pointer rounded-4xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-950 sm:w-65"
      >
        {/* Movimiento al pasar el cursor (solo en dispositivos con puntero para no distorsionar en táctil) */}
        <span
          className={`block transition-transform duration-300 ease-out motion-reduce:transform-none ${
            flipped ? 'md:group-hover:-translate-y-1' : 'md:group-hover:-translate-y-2 md:group-hover:rotate-0'
          }`}
        >
          {/* Giro: perspective y backface-hidden solo se activan durante el giro para que en reposo el texto se renderice en 2D nativo 100% nítido */}
          <span className={`relative block aspect-3/4 ${isFlipping ? 'perspective-distant' : ''}`}>
            {/* Frente: imagen + nombre */}
            <span
              aria-hidden={flipped}
              className={`absolute inset-0 block overflow-hidden rounded-4xl shadow-xl shadow-amber-950/25 transition-transform duration-700 ease-in-out motion-reduce:duration-0 ${
                showImage ? 'bg-amber-900' : fallback
              } ${
                flipped
                  ? 'pointer-events-none backface-hidden transform-[rotateY(-180deg)]'
                  : isFlipping
                    ? 'backface-hidden transform-none'
                    : 'transform-none'
              } ${flipped && !isFlipping ? 'invisible' : ''}`}
            >
              {showImage && (
                <img
                  src={town.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
                  onError={() => setImageFailed(true)}
                />
              )}
              <span className="absolute inset-0 bg-linear-to-t from-amber-950/85 via-amber-950/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-xl font-extrabold leading-tight text-white sm:p-6 sm:text-2xl">
                {town.name}
              </span>
            </span>

            {/* Reverso: descripción */}
            <span
              aria-hidden={!flipped}
              onTransitionEnd={(e) => {
                if (e.target === e.currentTarget) setIsFlipping(false)
              }}
              className={`absolute inset-0 flex flex-col overflow-hidden rounded-4xl border border-amber-600 bg-amber-100 p-5 shadow-xl shadow-amber-950/25 transition-transform duration-700 ease-in-out motion-reduce:duration-0 sm:p-6 ${
                flipped
                  ? isFlipping
                    ? 'backface-hidden transform-none'
                    : 'transform-none'
                  : 'pointer-events-none backface-hidden transform-[rotateY(180deg)]'
              } ${!flipped && !isFlipping ? 'invisible' : ''}`}
            >
              <span className="text-xl font-extrabold leading-tight text-amber-950 sm:text-2xl">{town.name}</span>
              <span className="mt-2.5 flex-1 overflow-y-auto overscroll-contain text-sm leading-relaxed text-amber-800 sm:mt-3 sm:text-base">
                {town.description}
              </span>
              <span className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-amber-600 sm:mt-3 sm:text-sm">
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
