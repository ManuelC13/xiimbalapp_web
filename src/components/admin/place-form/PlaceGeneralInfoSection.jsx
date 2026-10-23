const LABEL = 'text-sm font-semibold text-amber-950'
const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'
const TEXTAREA =
  'w-full rounded-2xl border border-gris-100 bg-white p-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function PlaceGeneralInfoSection({
  name,
  setName,
  description,
  setDescription,
  historicalInfo,
  setHistoricalInfo,
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-amber-950">Información general</h2>

      <div className="mt-5 space-y-4">
        <div className="space-y-1">
          <label htmlFor="place-name" className={LABEL}>
            Nombre del lugar <span className="text-error">*</span>
          </label>
          <input
            id="place-name"
            type="text"
            required
            placeholder="Ej. Convento de San Antonio, Cenote Xkekén..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="place-desc" className={LABEL}>
            Descripción <span className="text-error">*</span>
          </label>
          <textarea
            id="place-desc"
            required
            rows={3}
            placeholder="Describe los atractivos y lo que ofrece este lugar..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={TEXTAREA}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="place-history" className={LABEL}>
            Información histórica o curiosidades
          </label>
          <textarea
            id="place-history"
            rows={2}
            placeholder="Detalles sobre su fundación, leyendas o importancia cultural..."
            value={historicalInfo}
            onChange={(e) => setHistoricalInfo(e.target.value)}
            className={TEXTAREA}
          />
        </div>
      </div>
    </section>
  )
}
