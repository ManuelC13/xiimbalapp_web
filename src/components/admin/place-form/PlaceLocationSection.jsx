import { ExternalLink } from 'lucide-react'

const LABEL = 'text-sm font-semibold text-amber-950'
const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function PlaceLocationSection({
  address,
  setAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  mapsUrl,
}) {
  return (
    <section className="border-t border-amber-950/10 pt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-amber-950">Ubicación</h2>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-950 transition hover:text-amber-800"
          >
            <ExternalLink className="size-4" />
            Ver en Google Maps
          </a>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-1">
          <label htmlFor="place-addr" className={LABEL}>
            Dirección
          </label>
          <input
            id="place-addr"
            type="text"
            placeholder="Calle o referencia en el pueblo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={INPUT}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="place-lat" className={LABEL}>
              Latitud <span className="text-error">*</span>
            </label>
            <input
              id="place-lat"
              type="number"
              step="any"
              required
              placeholder="Ej. 20.9328"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={INPUT}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="place-lng" className={LABEL}>
              Longitud <span className="text-error">*</span>
            </label>
            <input
              id="place-lng"
              type="number"
              step="any"
              required
              placeholder="Ej. -89.0189"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={INPUT}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
