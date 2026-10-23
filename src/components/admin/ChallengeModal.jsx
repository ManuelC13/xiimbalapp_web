import { X, Target } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useChallengeModal } from '@/hooks/admin/useChallengeModal'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'
const TEXTAREA =
  'w-full resize-none rounded-2xl border border-gris-100 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

function Field({ label, htmlFor, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-amber-950">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gris-700">{hint}</p>}
    </div>
  )
}

export default function ChallengeModal({
  isOpen,
  challenge = null,
  badges = [],
  places = [],
  categories = [],
  towns = [],
  onClose,
  onSaved,
}) {
  const { form, setField, loading, error, isEditing, isPlace, handleSubmit } = useChallengeModal({
    isOpen,
    challenge,
    onClose,
    onSaved,
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-amber-950/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="my-auto w-full max-w-2xl rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Target className="size-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-amber-950">
              {isEditing ? 'Editar Reto' : 'Nuevo Reto'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gris-700 hover:bg-amber-950/10"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Tipo de reto (no editable una vez creado) */}
          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-amber-950">Tipo de reto</span>
            <div className="flex gap-2">
              {[
                { id: 'platform', label: 'De plataforma', hint: 'Se completa visitando lugares' },
                { id: 'place', label: 'De negocio', hint: 'Se completa con un código' },
              ].map((t) => {
                const active = form.challenge_type === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={isEditing}
                    onClick={() => setField('challenge_type', t.id)}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed ${
                      active
                        ? 'border-amber-950 bg-amber-950 text-white'
                        : 'border-gris-100 bg-white text-amber-950 hover:bg-amber-100 disabled:opacity-50'
                    }`}
                  >
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className={`text-xs ${active ? 'text-amber-100' : 'text-gris-700'}`}>{t.hint}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <Field label="Nombre del reto" htmlFor="ch-name" required>
            <input
              id="ch-name"
              type="text"
              required
              maxLength={150}
              placeholder="Ej. Ruta de los cenotes"
              value={form.challenge_name}
              onChange={(e) => setField('challenge_name', e.target.value)}
              className={INPUT}
            />
          </Field>

          <Field label="Descripción" htmlFor="ch-desc" required>
            <textarea
              id="ch-desc"
              required
              rows={3}
              placeholder="Explica de qué trata el reto..."
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className={TEXTAREA}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Insignia que otorga" htmlFor="ch-badge" required>
              <select
                id="ch-badge"
                required
                value={form.badge_id}
                onChange={(e) => setField('badge_id', e.target.value)}
                className={INPUT}
              >
                <option value="">Selecciona una insignia</option>
                {badges.map((b) => (
                  <option key={b.badge_id} value={b.badge_id}>
                    {b.badge_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Estado" htmlFor="ch-status">
              <select
                id="ch-status"
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                className={INPUT}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="postponed">Pospuesto</option>
              </select>
            </Field>
          </div>

          {/* Configuración específica según el tipo */}
          {isPlace ? (
            <div className="space-y-5 rounded-2xl border border-gris-100 bg-white p-4">
              <Field label="Lugar del reto" htmlFor="ch-place" required>
                <select
                  id="ch-place"
                  required
                  value={form.place_id}
                  onChange={(e) => setField('place_id', e.target.value)}
                  className={INPUT}
                >
                  <option value="">Selecciona un lugar</option>
                  {places.map((p) => (
                    <option key={p.place_id} value={p.place_id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Código de verificación"
                htmlFor="ch-code"
                hint={
                  isEditing
                    ? 'Generado automáticamente. Puedes copiarlo o regenerarlo desde la tarjeta del reto.'
                    : 'Se genera automáticamente al crear el reto.'
                }
              >
                <input
                  id="ch-code"
                  type="text"
                  readOnly
                  disabled
                  tabIndex={-1}
                  placeholder="Se generará automáticamente"
                  value={challenge?.verification_code || ''}
                  className={`${INPUT} cursor-not-allowed bg-gris-100/60 font-mono tracking-widest text-gris-700`}
                />
              </Field>
            </div>
          ) : (
            <div className="space-y-5 rounded-2xl border border-gris-100 bg-white p-4">
              <Field
                label="Meta: lugares distintos a visitar"
                htmlFor="ch-target"
                required
                hint="Cuenta lugares distintos visitados que cumplan los filtros de abajo."
              >
                <input
                  id="ch-target"
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={form.target_count}
                  onChange={(e) => setField('target_count', e.target.value)}
                  className={INPUT}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Pueblo Mágico (opcional)" htmlFor="ch-town">
                  <select
                    id="ch-town"
                    value={form.magical_town_id}
                    onChange={(e) => setField('magical_town_id', e.target.value)}
                    className={INPUT}
                  >
                    <option value="">Cualquiera</option>
                    {towns.map((t) => (
                      <option key={t.magical_town_id} value={t.magical_town_id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Categoría (opcional)" htmlFor="ch-category">
                  <select
                    id="ch-category"
                    value={form.category_id}
                    onChange={(e) => setField('category_id', e.target.value)}
                    className={INPUT}
                  >
                    <option value="">Cualquiera</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name ?? c.category_name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Fecha de inicio (opcional)" htmlFor="ch-start">
              <input
                id="ch-start"
                type="date"
                value={form.start_date}
                onChange={(e) => setField('start_date', e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Fecha de fin (opcional)" htmlFor="ch-end">
              <input
                id="ch-end"
                type="date"
                min={form.start_date || undefined}
                value={form.end_date}
                onChange={(e) => setField('end_date', e.target.value)}
                className={INPUT}
              />
            </Field>
          </div>

          {/* Solo los retos de negocio pueden ofrecer una recompensa adicional */}
          {isPlace && (
            <Field label="Recompensa (opcional)" htmlFor="ch-reward">
              <input
                id="ch-reward"
                type="text"
                maxLength={150}
                placeholder="Ej. 10% de descuento en tu siguiente visita"
                value={form.reward}
                onChange={(e) => setField('reward', e.target.value)}
                className={INPUT}
              />
            </Field>
          )}

          <Field label="Requisitos (opcional)" htmlFor="ch-req">
            <textarea
              id="ch-req"
              rows={2}
              placeholder="Condiciones adicionales para completar el reto..."
              value={form.requirements}
              onChange={(e) => setField('requirements', e.target.value)}
              className={TEXTAREA}
            />
          </Field>

          {error && (
            <p className="rounded-xl border border-border-error bg-background-error px-4 py-2.5 text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Reto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}