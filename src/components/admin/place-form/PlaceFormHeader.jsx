import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { resolveImageUrl } from '@/api/places'

export default function PlaceFormHeader({
  town,
  townId,
  isEditing,
  name,
  isActive,
}) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(`/admin/towns/${townId}`, { state: { town } })}
          className="inline-flex items-center gap-2 text-base font-semibold text-amber-950 transition hover:text-amber-800"
        >
          <ArrowLeft className="size-5" />
          <span>Volver a {town?.name || 'Pueblo Mágico'}</span>
        </button>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-amber-950 text-white shadow-xl shadow-amber-950/10">
        {town?.image_url && (
          <img
            src={resolveImageUrl(town.image_url)}
            alt={town.name}
            className="absolute inset-0 size-full object-cover opacity-35"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <div className="relative flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-end sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-sm font-medium backdrop-blur-md">
              <MapPin className="size-4 text-amber-400" />
              <span>{town?.name || 'Pueblo Mágico'}</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {isEditing ? name || 'Editar Lugar' : 'Nuevo Lugar'}
            </h1>
            <p className="mt-2 text-amber-100/90">
              {isEditing ? 'Editando lugar' : 'Registrando un nuevo lugar'}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md sm:self-auto ${
              isActive ? 'bg-success-light/90 text-success' : 'bg-background-error/90 text-error'
            }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
    </div>
  )
}
