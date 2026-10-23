import { useNavigate } from 'react-router-dom'
import { MapPin, Save } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PlaceFormHeader({
  town,
  townId,
  isEditing,
  name,
  isActive,
  saving,
  onCancel,
  onSubmit,
}) {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Barra de migas de pan / Breadcrumbs interactiva */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs font-semibold text-gris-700">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="transition hover:text-amber-950 hover:underline"
        >
          Pueblos Mágicos
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigate(`/admin/towns/${townId}`, { state: { town } })}
          className="transition hover:text-amber-950 hover:underline text-amber-950 font-bold"
        >
          {town?.name || 'Pueblo'}
        </button>
        <span>/</span>
        <span className="rounded-full bg-amber-200/60 px-2.5 py-0.5 text-amber-950 font-bold">
          {isEditing ? 'Editar Lugar' : 'Nuevo Lugar'}
        </span>
      </nav>

      {/* Header Principal */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 size-32 rounded-full bg-amber-100/50 blur-2xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-950">
                <MapPin className="size-3.5 text-amber-800" />
                {town?.name || 'Pueblo Mágico'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  isActive
                    ? 'bg-success-light text-success'
                    : 'bg-background-error text-error'
                }`}
              >
                <span className={`size-2 rounded-full ${isActive ? 'bg-success' : 'bg-error'}`} />
                {isActive ? 'Visible en XiimbalApp' : 'Oculto'}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
              {isEditing ? name || 'Editar Lugar' : 'Registrar Nuevo Lugar'}
            </h1>
            <p className="max-w-2xl text-sm text-gris-700">
              {isEditing
                ? `Actualiza la información, geolocalización, etiquetas y fotografías de este atractivo turístico en ${town?.name}.`
                : `Completa los datos del nuevo punto de interés para que los visitantes lo descubran en ${town?.name}.`}
            </p>
          </div>

          {/* Acciones principales en cabecera */}
          <div className="flex shrink-0 items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="button" size="sm" onClick={onSubmit} disabled={saving}>
              <Save className="size-4" />
              {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Lugar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
