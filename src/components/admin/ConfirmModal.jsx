import { AlertTriangle, Info, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ConfirmModal({
  isOpen,
  title = '¿Confirmar acción?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  isWarningOnly = false,
  warningActionText = '',
  loading = false,
  onClose,
  onConfirm,
  onWarningAction,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex size-10 items-center justify-center rounded-2xl ${
                isWarningOnly
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-background-error text-error'
              }`}
            >
              {isWarningOnly ? <Info className="size-5" /> : <AlertTriangle className="size-5" />}
            </span>
            <h3 className="text-xl font-bold text-amber-950">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-gris-700 hover:bg-amber-950/10"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gris-700">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          {isWarningOnly ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cerrar
              </Button>
              {warningActionText && onWarningAction && (
                <Button type="button" size="sm" onClick={onWarningAction}>
                  {warningActionText}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-full bg-error px-5 text-base font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? 'Eliminando...' : confirmText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
