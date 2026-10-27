import { Trash2, RefreshCw, Download, Printer } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PlaceQrActions({
  onOpenRevoke,
  onOpenRegenerate,
  onDownloadPng,
  onPrint,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-amber-950/10 pt-5">
      {/* Izquierda: Acciones de gestión */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenRevoke}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border-error/30 bg-background-error/40 px-3 py-2 text-xs font-semibold text-error transition hover:bg-background-error cursor-pointer"
          title="Desactivar este código QR"
        >
          <Trash2 className="size-3.5" />
          <span>Revocar</span>
        </button>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-950/15 bg-amber-50/60 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 cursor-pointer"
          title="Generar un nuevo token para reemplazar este código"
        >
          <RefreshCw className="size-3.5" />
          <span>Regenerar</span>
        </button>
      </div>

      {/* Derecha: Acciones principales */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onDownloadPng}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-950/15 bg-white px-3.5 py-2 text-xs font-semibold text-amber-950 shadow-xs transition hover:bg-amber-50 cursor-pointer"
        >
          <Download className="size-4 text-amber-800" />
          <span>Descargar en PNG</span>
        </button>

        <Button
          type="button"
          onClick={onPrint}
          size="sm"
          className="cursor-pointer"
        >
          <Printer className="size-4" />
          <span>Diseño de validación</span>
        </Button>
      </div>
    </div>
  )
}
