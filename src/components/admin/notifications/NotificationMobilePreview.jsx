import { Bell, ChevronRight, Smartphone } from 'lucide-react'

export default function NotificationMobilePreview({
  title,
  body,
  screen,
  screens,
  selectedPlace,
}) {
  const targetLabel =
    screen === 'place' && selectedPlace
      ? selectedPlace.name || selectedPlace.place_name
      : screens.find((s) => s.id === screen)?.label || 'Inicio'

  return (
    <div className="sticky top-32 space-y-4">
      {/* Tarjeta contenedora */}
      <div className="rounded-3xl border border-gris-100 bg-white p-6 shadow-sm space-y-4">
        {/* Cabecera de la sección de vista previa */}
        <div className="flex items-center justify-between pb-3 border-b border-gris-100">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
              <Smartphone className="size-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
              Vista previa en dispositivo
            </span>
          </div>
          <span className="text-[11px] font-semibold text-gris-400">Push móvil</span>
        </div>

        {/* Tarjeta de notificación simulada */}
        <div className="rounded-2xl border border-amber-950/15 bg-amber-50/70 p-4 shadow-sm transition-all hover:bg-amber-50">
          <div className="flex items-start gap-3.5">
            {/* Ícono de la app */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-900 text-white font-extrabold text-sm shadow-sm">
              X
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
                  XíimbalApp
                </span>
                <span className="text-[11px] font-semibold text-gris-400">ahora</span>
              </div>

              {/* Título */}
              <p className="text-sm font-bold text-amber-950 leading-snug wrap-break-words">
                {title?.trim() || 'Título de la notificación'}
              </p>

              {/* Mensaje */}
              <p className="text-xs text-gris-700 leading-relaxed wrap-break-words">
                {body?.trim() || 'Aquí aparecerá el cuerpo del mensaje que envíes a tus usuarios.'}
              </p>

              {/* Destino */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-950">
                  <ChevronRight className="size-3 text-amber-900" />
                  <span>Abre: {targetLabel}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gris-700">
          Así verán la notificación los usuarios en la pantalla de su teléfono móvil.
        </p>
      </div>
    </div>
  )
}
