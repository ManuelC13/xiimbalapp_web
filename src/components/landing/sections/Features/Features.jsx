import { FEATURES } from '@/config/features'
import FeatureRow from './FeatureRow'
import Section from '../../Section'

export default function Features() {
  return (
    <div className="relative bg-amber-100/40">
      {/* Onda orgánica superior (recorte sólido del color de fondo base para evitar líneas entre capas translúcidas) */}
      <div className="pointer-events-none relative -top-0.5 overflow-hidden text-amber-50" aria-hidden>
        <svg viewBox="0 0 1440 72" fill="currentColor" className="block h-10 w-full sm:h-16" preserveAspectRatio="none">
          <path d="M0,40 C320,80 620,0 960,36 C1200,62 1350,24 1440,12 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <Section
        id="que-puedes-hacer"
        title="Qué puedes hacer con XíimbalApp"
        subtitle="Explora, juega y colecciona mientras recorres Yucatán."
        align="center"
        reveal
        className="overflow-clip"
      >
        <div className="space-y-20 lg:space-y-32">
          {FEATURES.map((feature, index) => (
            <FeatureRow key={feature.id} feature={feature} reverse={index % 2 === 1} />
          ))}
        </div>
      </Section>

      {/* Onda orgánica inferior */}
      <div className="pointer-events-none relative -bottom-0.5 overflow-hidden text-amber-50" aria-hidden>
        <svg viewBox="0 0 1440 72" fill="currentColor" className="block h-10 w-full sm:h-16" preserveAspectRatio="none">
          <path d="M0,72 L1440,72 L1440,32 C1140,72 820,4 480,42 C240,68 90,36 0,18 Z" />
        </svg>
      </div>
    </div>
  )
}
