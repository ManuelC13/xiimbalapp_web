import PhoneShowcase from './PhoneShowCase'

// Con reverse, el texto va a la izquierda y la imagen a la derecha (en escritorio).
export default function FeatureRow({ feature, reverse = false }) {
  const { title, description, image, imageAlt, gradient, preview } = feature

  return (
    <article className="mt-30 grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
      <div className={reverse ? 'lg:order-2' : 'lg:order-1'}>
        <PhoneShowcase image={image} imageAlt={imageAlt} gradient={gradient} preview={preview} />
      </div>

      <div className={reverse ? 'lg:order-1' : 'lg:order-2'}>
        <h3 className="text-3xl font-extrabold tracking-tight  text-amber-800 sm:text-4xl">{title}</h3>
        <p className="mt-5 text-lg leading-relaxed text-amber-800 sm:text-xl">{description}</p>
      </div>
    </article>
  )
}