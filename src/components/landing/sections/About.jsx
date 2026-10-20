import { MapPinned, Store, Trophy } from 'lucide-react'
import Section from '../Section'

const HIGHLIGHTS = [
  {
    icon: MapPinned,
    title: 'Todo en un mapa',
    text: 'Los atractivos y negocios locales de cada Pueblo Mágico, en un solo lugar.',
  },
  {
    icon: Trophy,
    title: 'Explorar es un juego',
    text: 'Registra tus visitas, completa retos y gana insignias.',
  },
  {
    icon: Store,
    title: 'Apoyo a lo local',
    text: 'Cada visita ayuda a que los negocios de la región sean más fáciles de descubrir.',
  },
]

export default function About() {
  return (
    <Section id="que-es">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">¿Qué es XíimbalApp?</h2>
          <p className="mt-6 text-lg leading-relaxed text-amber-800 sm:text-xl">
            XíimbalApp es una aplicación móvil para descubrir los Pueblos Mágicos de Yucatán de una forma
            diferente: con un mapa interactivo, retos y recompensas.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-amber-800 sm:text-xl">
            Reúne en un solo lugar los atractivos turísticos y los negocios locales de cada pueblo, para que
            encuentres qué visitar sin andar buscando entre páginas y redes sociales.
          </p>
        </div>

        <ul className="space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex items-start gap-5 rounded-3xl border border-amber-100 bg-white p-6 shadow-lg shadow-amber-950/5"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-amber-950">
                <Icon className="size-7" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl font-extrabold">{title}</h3>
                <p className="mt-1 leading-relaxed text-amber-800">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}