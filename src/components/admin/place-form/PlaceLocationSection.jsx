import { Compass, ExternalLink } from 'lucide-react'

const LABEL = 'block text-xs font-bold uppercase tracking-wider text-amber-950/80 mb-2'
const INPUT =
  'h-12 w-full rounded-2xl border border-amber-950/15 bg-white px-4 text-base text-amber-950 placeholder:text-gris-400 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/50'

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
    <div className="rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between border-b border-amber-950/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-950">
            <Compass className="size-5 text-amber-900" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-950">Ubicación y Coordenadas GPS</h2>
            <p className="text-xs text-gris-700">Para ubicar el pin en el mapa y cálculo de rutas</p>
          </div>
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-950/20 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-950 transition hover:bg-amber-100"
          >
            <ExternalLink className="size-3.5" />
            <span>Ver en Google Maps</span>
          </a>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="place-addr" className={LABEL}>
            Dirección o Referencia
          </label>
          <input
            id="place-addr"
            type="text"
            placeholder="Ej. Calle 31 entre 28 y 30, Centro"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={INPUT}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="place-lat" className={LABEL}>
              Latitud <span className="text-error">*</span>
            </label>
            <input
              id="place-lat"
              type="number"
              step="any"
              required
              placeholder="20.9328"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={INPUT}
            />
            <p className="mt-1.5 text-xs text-gris-400">Coordenada en formato decimal (ej. 20.9328)</p>
          </div>
          <div>
            <label htmlFor="place-lng" className={LABEL}>
              Longitud <span className="text-error">*</span>
            </label>
            <input
              id="place-lng"
              type="number"
              step="any"
              required
              placeholder="-89.0189"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={INPUT}
            />
            <p className="mt-1.5 text-xs text-gris-400">Coordenada en formato decimal (ej. -89.0189)</p>
          </div>
        </div>

        {mapsUrl && (
          <div className="sm:hidden pt-1">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 underline"
            >
              <ExternalLink className="size-3.5" />
              <span>Abrir y verificar coordenadas en Google Maps</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
