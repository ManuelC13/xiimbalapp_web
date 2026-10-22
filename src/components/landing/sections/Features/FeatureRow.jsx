import PhoneShowcase from './PhoneShowCase'
import useInView from '@/hooks/useInView'

// Con reverse, el texto va a la izquierda y la imagen a la derecha (en escritorio).
export default function FeatureRow({ feature, reverse = false }) {
  const { title, description, image, imageAlt, gradient, preview } = feature
  const [ref, inView] = useInView()

  // Al aparecer, la imagen y el texto entran desde lados opuestos (en móvil, desde abajo)
  const visible = 'opacity-100 translate-y-0 lg:translate-x-0'
  const phoneHidden = reverse ? 'opacity-0 translate-y-10 lg:translate-y-0 lg:translate-x-16' : 'opacity-0 translate-y-10 lg:translate-y-0 lg:-translate-x-16'
  const textHidden = reverse ? 'opacity-0 translate-y-10 lg:translate-y-0 lg:-translate-x-16' : 'opacity-0 translate-y-10 lg:translate-y-0 lg:translate-x-16'

  return (
    <article ref={ref} className="lg:mt-30 mt-15 grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
      <div className={`transition duration-800 ease-out ${reverse ? 'lg:order-2' : 'lg:order-1'} ${inView ? visible : phoneHidden}`}>
        <PhoneShowcase image={image} imageAlt={imageAlt} gradient={gradient} preview={preview} reverse={reverse} />
      </div>

      <div className={`transition duration-800 delay-300 ease-out ${reverse ? 'lg:order-1' : 'lg:order-2'} ${inView ? visible : textHidden}`}>
        <h3 className="text-3xl font-extrabold tracking-tight  text-amber-800 sm:text-4xl">{title}</h3>
        <p className="mt-5 text-lg leading-relaxed text-amber-800 sm:text-xl">{description}</p>
      </div>
    </article>
  )
}