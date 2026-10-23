import { Tag } from 'lucide-react'

export default function PlaceSidebar({
  isActive,
  setIsActive,
  categories,
  selectedCategories,
  toggleCategory,
}) {
  return (
    <aside className="space-y-8 self-start rounded-2xl border border-amber-800/25 bg-amber-50 p-6 lg:col-span-1">
      <section>
        <h2 className="text-xl font-bold text-amber-950">Estado</h2>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-950">
              {isActive ? 'Activo' : 'Inactivo'}
            </p>
            <p className="text-xs text-gris-700">
              {isActive ? 'Visible en la app' : 'Oculto en la app'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label="Activar o desactivar lugar"
            onClick={() => setIsActive((prev) => !prev)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
              isActive ? 'bg-amber-950' : 'bg-gris-100'
            }`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      <section className="border-t border-amber-950/10 pt-8">
        <h2 className="text-xl font-bold text-amber-950">Categorías</h2>

        <div className="mt-4">
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.category_id)
                return (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => toggleCategory(cat.category_id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      active
                        ? 'bg-amber-950 text-white'
                        : 'border border-gris-100 bg-white text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    <Tag className="size-3.5" />
                    {cat.category_name}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-gris-400">Cargando categorías...</p>
          )}
        </div>
      </section>
    </aside>
  )
}
