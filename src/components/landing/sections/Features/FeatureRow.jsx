import Reveal from '@/components/ui/Reveal'
import PhoneShowcase from './PhoneShowCase'
import useInView from '@/hooks/useInView'

// Con reverse, el texto va a la izquierda y la imagen a la derecha (en escritorio).
export default function FeatureRow({ feature, reverse = false }) {
  const { title, description, image, imageAlt, gradient, preview } = feature

  return (
    <article className="mt-8 grid items-center gap-6 sm:mt-15 sm:gap-10 lg:mt-30 lg:grid-cols-2 lg:gap-24">
      <Reveal direction={reverse ? 'right' : 'left'} className={reverse ? 'lg:order-2' : 'lg:order-1'}>
        <PhoneShowcase image={image} imageAlt={imageAlt} gradient={gradient} preview={preview} reverse={reverse} />
      </Reveal>

      <Reveal
        direction={reverse ? 'left' : 'right'}
        delay={200}
        className={reverse ? 'lg:order-1' : 'lg:order-2'}
      >
        <h3 className="text-2xl font-extrabold tracking-tight text-amber-800 sm:text-4xl">{title}</h3>
        <p className="mt-3 text-base leading-relaxed text-amber-800 sm:mt-5 sm:text-xl">{description}</p>
      </Reveal>
    </article>
  )
}
