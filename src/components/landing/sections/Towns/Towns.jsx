import { TOWNS } from '@/config/towns'
import Section from '../../Section'
import TownsCarousel from './TownsCarousel'

export default function Towns() {
  return (
    <Section
      id="pueblos"
      title="Pueblos Mágicos"
      subtitle="Descubre los pueblos que puedes explorar con XíimbalApp."
      align="center"
      className="overflow-hidden"
    >
      <TownsCarousel towns={TOWNS} />
    </Section>
  )
}