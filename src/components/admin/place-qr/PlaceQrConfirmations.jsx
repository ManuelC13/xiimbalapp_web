import { AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PlaceQrConfirmations({
  placeName,
  actionLoading,
  showConfirmRegenerate,
  showConfirmRevoke,
  onCancelRegenerate,
  onConfirmRegenerate,
  onCancelRevoke,
  onConfirmRevoke,
}) {
  return (
    <>
      {/* Confirmación para Regenerar */}
      {showConfirmRegenerate && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-800" />
            <div className="flex-1 text-sm text-amber-950">
              <p className="font-bold">¿Deseas generar un nuevo código QR?</p>
              <p className="mt-1 text-xs text-amber-900">
                Al generar un nuevo código, el código QR actual y cualquier copia impresa
                en el lugar quedarán inmediatamente <strong>invalidados</strong>. Deberás
                imprimir y colocar el nuevo código.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={actionLoading}
                  onClick={onConfirmRegenerate}
                >
                  {actionLoading ? 'Generando...' : 'Sí, generar nuevo QR'}
                </Button>
                <button
                  type="button"
                  onClick={onCancelRegenerate}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-gris-600 hover:bg-amber-100 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación para Revocar */}
      {showConfirmRevoke && (
        <div className="mt-6 rounded-2xl border border-border-error bg-background-error p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-error" />
            <div className="flex-1 text-sm text-error">
              <p className="font-bold">¿Estás seguro de revocar este código QR?</p>
              <p className="mt-1 text-xs text-error/90">
                Los turistas no podrán validar visitas a {placeName} hasta que generes
                un nuevo código.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={onConfirmRevoke}
                  className="rounded-xl bg-error px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-error/90 cursor-pointer"
                >
                  {actionLoading ? 'Revocando...' : 'Sí, revocar código'}
                </button>
                <button
                  type="button"
                  onClick={onCancelRevoke}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-gris-600 hover:bg-white cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
