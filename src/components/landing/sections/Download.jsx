import { Download as DownloadIcon, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import BrandIcon from '@/components/ui/BrandIcon'
import { SITE } from '@/config/site'
import useInView from '@/hooks/useInView'
import Section from '../Section'

const INSTALL_STEPS = [
  'Descarga el archivo APK en tu teléfono.',
  'Si Android lo solicita, permite la instalación desde esta fuente.',
  'Abre el archivo descargado y toca "Instalar".',
]

// Mientras SITE.apk.url esté vacío se muestra el estado "Próximamente".
export default function Download() {
  const { url, version, size, minAndroid } = SITE.apk
  const available = Boolean(url)
  const [ref, inView] = useInView({ threshold: 0.2 })

  const details = [
    ['Versión', version],
    ['Tamaño', size],
    ['Requiere', minAndroid],
  ].filter(([, value]) => value)

  const notifyHref = SITE.contactEmail
    ? `mailto:${SITE.contactEmail}?subject=${encodeURIComponent('Avísame cuando XíimbalApp esté disponible')}`
    : null

  return (
    <Section
      id="descargar"
      title="¿Listo para explorar?"
      subtitle={
        available
          ? 'Por ahora, puedes disfrutar de XíimbalApp en dispositivos Android. ¡Descárgala y descubre tu próxima aventura!'
          : 'Disponible muy pronto para su descarga. ¡Esperanos y encuentra tu próxima aventura con XíimbalApp!'
      }
      align="center"
      className="bg-amber-100/50"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-3xl rounded-[2.5rem] border border-amber-100 bg-white p-8 text-center shadow-xl shadow-amber-950/10 transition duration-800 ease-out sm:p-12 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="relative mx-auto size-20">
          <span
            className="absolute -inset-3 animate-circle-pulse rounded-4xl bg-amber-300/40 motion-reduce:animate-none"
            aria-hidden
          />
          <span className="relative flex size-20 items-center justify-center rounded-3xl bg-amber-500 text-amber-950">
            <BrandIcon name="android" className="size-10" />
          </span>
        </div>

        <h3 className="mt-8 text-2xl font-extrabold sm:text-3xl">XíimbalApp (Android)</h3>

        <span
          className={`mt-4 inline-block rounded-full px-4 py-1 text-sm font-bold ${
            available ? 'bg-success-light text-success' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {available ? 'Disponible' : 'Próximamente'}
        </span>

        {details.length > 0 && (
          <dl className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-amber-800">{label}</dt>
                <dd className="font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {available ? (
            <Button href={url} size="lg">
              <DownloadIcon className="size-5" aria-hidden />
              Descargar APK
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                disabled
                className="disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-amber-950"
              >
                <DownloadIcon className="size-5" aria-hidden />
                Descargar APK
              </Button>
              {/*notifyHref && (
                <Button href={notifyHref} variant="outline" size="lg">
                  <Mail className="size-5" aria-hidden />
                  Avísame cuando esté lista
                </Button>
              )*/}
            </>
          )}
        </div>

        <div className="mt-10 border-t border-amber-100 pt-8 text-left">
          <h4 className="text-center text-lg font-extrabold text-amber-800">Cómo instalarla</h4>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {INSTALL_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 font-extrabold text-amber-950">
                  {index + 1}
                </span>
                <span className="leading-snug text-amber-800">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}