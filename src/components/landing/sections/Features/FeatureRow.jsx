import Reveal from '@/components/ui/Reveal'
import PhoneShowcase from './PhoneShowCase'
import useInView from '@/hooks/useInView'

// Con reverse, el texto va a la izquierda y la imagen a la derecha (en escritorio).
export default function FeatureRow({ feature, reverse = false }) {
  const { title, description, image, imageAlt, gradient, preview } = feature

  return (
    <article className="lg:mt-30 mt-15 grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
      <Reveal direction={reverse ? 'right' : 'left'} className={reverse ? 'lg:order-2' : 'lg:order-1'}>
        <PhoneShowcase image={image} imageAlt={imageAlt} gradient={gradient} preview={preview} reverse={reverse} />
      </Reveal>

      <Reveal direction={reverse ? 'left' : 'right'} delay={200} className={reverse ? 'lg:order-1' : 'lg:order-2'}>
        <h3 className="text-3xl font-extrabold tracking-tight  text-amber-800 sm:text-4xl">{title}</h3>
        <p className="mt-5 text-lg leading-relaxed text-amber-800 sm:text-xl">{description}</p>
      </Reveal>
    </article>
  )
}