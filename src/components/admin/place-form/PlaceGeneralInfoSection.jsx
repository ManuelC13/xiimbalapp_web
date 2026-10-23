import { Sparkles } from 'lucide-react'

const LABEL = 'block text-xs font-bold uppercase tracking-wider text-amber-950/80 mb-2'
const INPUT =
  'h-12 w-full rounded-2xl border border-amber-950/15 bg-white px-4 text-base text-amber-950 placeholder:text-gris-400 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/50'
const TEXTAREA =
  'w-full rounded-2xl border border-amber-950/15 bg-white p-4 text-base text-amber-950 placeholder:text-gris-400 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/50'

export default function PlaceGeneralInfoSection({
  name,
  setName,
  description,
  setDescription,
  historicalInfo,
  setHistoricalInfo,
}) {
  return (
    <div className="rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3 border-b border-amber-950/10 pb-4">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-950">
          <Sparkles className="size-5 text-amber-900" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-amber-950">Información del Atractivo</h2>
          <p className="text-xs text-gris-700">Detalles principales que se mostrarán al viajero</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="place-name" className={LABEL}>
            Nombre del Lugar <span className="text-error">*</span>
          </label>
          <input
            id="place-name"
            type="text"
            required
            placeholder="Ej. Convento de San Antonio de Padua"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT}
          />
          <p className="mt-1.5 text-xs text-gris-400">
            Nombre oficial o conocido popularmente del lugar.
          </p>
        </div>

        <div>
          <label htmlFor="place-desc" className={LABEL}>
            Descripción General <span className="text-error">*</span>
          </label>
          <textarea
            id="place-desc"
            required
            rows={4}
            placeholder="Describe qué hace único este lugar, las experiencias que ofrece y por qué visitarlo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={TEXTAREA}
          />
          <p className="mt-1.5 text-xs text-gris-400">
            Texto principal mostrado en la tarjeta de detalles en la aplicación.
          </p>
        </div>

        <div>
          <label htmlFor="place-history" className={LABEL}>
            Historia, Leyendas o Datos Curiosos <span className="text-xs font-normal text-gris-400">(Opcional)</span>
          </label>
          <textarea
            id="place-history"
            rows={3}
            placeholder="Detalles sobre su fundación, arquitectura, personajes históricos o leyendas mayas..."
            value={historicalInfo}
            onChange={(e) => setHistoricalInfo(e.target.value)}
            className={TEXTAREA}
          />
          <p className="mt-1.5 text-xs text-gris-400">
            Información enriquecida para la sección cultural de la ficha.
          </p>
        </div>
      </div>
    </div>
  )
}
