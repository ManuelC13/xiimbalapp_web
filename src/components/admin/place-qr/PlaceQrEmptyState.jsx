import { QrCode, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PlaceQrEmptyState({ actionLoading, onGenerateQr }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-800 shadow-inner">
        <QrCode className="size-10" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-amber-950">
        Sin Código QR Asignado
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gris-600">
        Este lugar aún no cuenta con un código QR activo. Genera uno para
        obtener su token criptográfico e imprimir la hoja de validación física.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button
          type="button"
          onClick={onGenerateQr}
          disabled={actionLoading}
          size="md"
        >
          <Sparkles className="size-4" />
          <span>{actionLoading ? 'Generando...' : 'Generar Código QR'}</span>
        </Button>
        <span className="text-xs text-gris-400">
          Se asociará de forma permanente y segura al lugar
        </span>
      </div>
    </div>
  )
}
