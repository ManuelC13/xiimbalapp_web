import { MapPinned, Store, Trophy } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import Section from '../Section'

const HIGHLIGHTS = [
  {
    icon: MapPinned,
    title: 'Todo en un mapa',
    text: 'Atractivos turísticos y negocios locales de cada Pueblo Mágico, en un solo lugar.',
  },
  {
    icon: Trophy,
    title: 'Explorar es un juego',
    text: 'Registra tus visitas, completa retos, desbloquea insignias y, gana recompensas dentro y fuera de la app.',
  },
  {
    icon: Store,
    title: 'Apoyo a lo local',
    text: 'Cada visita ayuda a que los negocios locales de la región sean más fáciles de descubrir.',
  },
]

export default function About() {
  return (
    <Section id="que-es" className="overflow-x-clip">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal direction="left">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">¿Qué es XíimbalApp?</h2>
          <p className="mt-6 text-lg leading-relaxed text-amber-800 sm:text-xl">
            Cada pueblo tiene una historia que contar, un lugar por descubrir y experiencias que 
            vale la pena vivir. <span className="font-extrabold">XíimbalApp</span> es tu compañera para explorar los Pueblos Mágicos de Yucatán, con 
            un mapa interactivo que te acerca a sus atractivos turísticos y a los negocios que dan vida a sus comunidades.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-amber-800 sm:text-xl">
            Olvídate de buscar información en mil lugares. Encuentra nuevas opciones para tu recorrido, atrévete a 
            completar retos y descubre una manera diferente de conocer Yucatán, mientras contribuyes a dar 
            visibilidad a quienes hacen únicos sus destinos.
          </p>
        </Reveal>

        <ul className="space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }, index) => (
            <Reveal as="li" key={title} direction="right" delay={index * 120}>
              <div
                className="group flex cursor-default items-center gap-5 rounded-3xl border border-amber-100 bg-white p-6 shadow-lg shadow-amber-950/5 transition duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-0 motion-reduce:hover:scale-100"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-amber-950 transition duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 group-hover:bg-amber-950 group-hover:text-amber-400 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                  <Icon className="size-7" aria-hidden />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold transition-colors duration-300 group-hover:text-amber-700">{title}</h3>
                  <p className="mt-1 leading-relaxed text-amber-800 lg:pr-2">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}