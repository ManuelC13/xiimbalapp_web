import { FEATURES } from '@/config/features'
import FeatureRow from './FeatureRow'
import Section from '../../Section'

export default function Features() {
  return (
    <Section
      id="que-puedes-hacer"
      title="Qué puedes hacer con XíimbalApp"
      subtitle="Explora, juega y colecciona mientras recorres Yucatán."
      align="center"
      className="overflow-clip bg-amber-100/40"
    >
      <div className="space-y-20 lg:space-y-32">
        {FEATURES.map((feature, index) => (
          <FeatureRow key={feature.id} feature={feature} reverse={index % 2 === 1} />
        ))}
      </div>
    </Section>
  )
}