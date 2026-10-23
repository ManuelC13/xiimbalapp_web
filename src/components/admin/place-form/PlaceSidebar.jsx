import { Tag, Check, Info } from 'lucide-react'
import { resolveImageUrl } from '@/api/places'

export default function PlaceSidebar({
  isActive,
  setIsActive,
  categories,
  selectedCategories,
  toggleCategory,
  town,
}) {
  return (
    <div className="space-y-8 lg:col-span-1">
      {/* TARJETA 1: Visibilidad / Publicación */}
      <div className="rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-7">
        <h2 className="text-base font-bold text-amber-950">Visibilidad y Publicación</h2>
        <p className="mt-0.5 text-xs text-gris-700">Controla si este lugar es visible en la aplicación</p>

        <div className="mt-5 rounded-2xl border border-amber-950/10 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex size-3 rounded-full ${
                  isActive ? 'bg-success ring-4 ring-success/20' : 'bg-error ring-4 ring-error/20'
                }`}
              />
              <div>
                <p className="text-sm font-bold text-amber-950">
                  {isActive ? 'Lugar Activo' : 'Lugar Oculto'}
                </p>
                <p className="text-xs text-gris-700">
                  {isActive ? 'Visible para todos los usuarios' : 'Solo administradores'}
                </p>
              </div>
            </div>

            {/* Switch estilo pill */}
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? 'bg-amber-950' : 'bg-gris-100'
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-1 ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-gris-700 border-t border-amber-950/10 pt-2.5">
            {isActive
              ? 'Este lugar se mostrará en los mapas, recomendaciones y filtros turísticos de XiimbalApp.'
              : 'Este lugar estará deshabilitado temporalmente y no se mostrará en las búsquedas móviles.'}
          </p>
        </div>
      </div>

      {/* TARJETA 2: Categorías Temáticas */}
      <div className="rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-amber-950">Categorías y Etiquetas</h2>
            <p className="mt-0.5 text-xs text-gris-700">
              Ayuda a los turistas a filtrar por intereses
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-950">
            {selectedCategories.length} seleccionada{selectedCategories.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-5">
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.category_id)
                return (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => toggleCategory(cat.category_id)}
                    className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                      active
                        ? 'bg-amber-950 text-white shadow-sm ring-2 ring-amber-950/20'
                        : 'border border-amber-950/15 bg-white text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    <Tag
                      className={`size-3.5 ${
                        active ? 'text-amber-300' : 'text-amber-800'
                      }`}
                    />
                    <span>{cat.category_name}</span>
                    {active && <Check className="size-3 text-amber-300 ml-0.5" />}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-gris-400">Cargando categorías disponibles...</p>
          )}
        </div>
      </div>

      {/* TARJETA 3: Información del Pueblo Mágico */}
      <div className="rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-7">
        <h2 className="text-base font-bold text-amber-950">Pueblo Mágico</h2>
        <p className="mt-0.5 text-xs text-gris-700">Municipio de pertenencia de este lugar</p>

        <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-amber-950/10 bg-amber-50/50 p-3.5">
          {town?.image_url ? (
            <img
              src={resolveImageUrl(town.image_url)}
              alt={town.name}
              className="size-12 rounded-xl object-cover shrink-0 border border-amber-950/10"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-200 text-amber-950 font-extrabold shrink-0">
              {town?.name?.[0] || 'P'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="truncate text-sm font-extrabold text-amber-950">{town?.name || 'Pueblo'}</p>
            <p className="text-xs text-gris-700">Yucatán, México</p>
          </div>
        </div>
      </div>

      {/* TARJETA 4: Consejos y Ayuda */}
      <div className="rounded-3xl border border-amber-950/10 bg-linear-to-br from-amber-100/60 to-amber-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
          <Info className="size-4 text-amber-800 shrink-0" />
          <span>Recomendaciones</span>
        </div>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-amber-950/80">
          <li className="flex items-start gap-1.5">
            <span className="font-bold">•</span>
            <span>
              <strong>Coordenadas exactas:</strong> Permiten que la navegación por GPS y la distancia en kilómetros se calculen con precisión.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-bold">•</span>
            <span>
              <strong>Fotografías horizontales:</strong> Lucen mucho mejor en el encabezado de la ficha del lugar en la app móvil.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
