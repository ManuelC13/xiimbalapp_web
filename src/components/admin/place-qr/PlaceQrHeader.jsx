import { QrCode, MapPin, X } from 'lucide-react'

export default function PlaceQrHeader({ placeName, townName, onClose }) {
  return (
    <div className="relative border-b border-amber-950/10 bg-linear-to-r from-amber-900 to-amber-950 px-6 py-5 text-white sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <QrCode className="size-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Código QR de Visita
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-amber-200/90 sm:text-sm">
              <MapPin className="size-3.5 shrink-0" />
              <span className="font-semibold text-white">{placeName}</span>
              {townName && <span>• {townName}</span>}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  )
}
