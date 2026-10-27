import { Copy, Check, Calendar, Sparkles } from 'lucide-react'
import { getXiimbalQrSvg } from '@/utils/qrCodeGenerator'
import { formatUtcDateTime } from '@/utils/dateUtils'

export default function PlaceQrActiveCard({
  placeName,
  qrData,
  includeLogo,
  onToggleLogo,
  copied,
  onCopyToken,
}) {
  const centerLogo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/images/logo-amber-950.png`
      : '/images/logo-amber-950.png'

  const qrBrandedSvg = qrData?.qr_value
    ? getXiimbalQrSvg({
        text: qrData.qr_value,
        logoUrl: centerLogo,
        margin: 4,
        darkColor: '#3b1d02',
        accentColor: '#ffbf00',
        showLogo: includeLogo,
      }).svg
    : null

  const formattedDate = qrData?.created_at
    ? formatUtcDateTime(qrData.created_at)
    : null

  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
      {/* Tarjeta con el QR */}
      <div className="relative mx-auto flex flex-col items-center rounded-3xl border-2 border-amber-950/10 bg-amber-50/50 p-6 shadow-inner">
        {/* Esquinas decorativas estilo escáner */}
        <div className="absolute left-3 top-3 size-4 border-l-2 border-t-2 border-amber-600" />
        <div className="absolute right-3 top-3 size-4 border-r-2 border-t-2 border-amber-600" />
        <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-amber-600" />
        <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-amber-600" />

        <div className="rounded-2xl bg-white p-3 shadow-md">
          {qrBrandedSvg && (
            <div
              className="size-48 sm:size-52 flex items-center justify-center [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: qrBrandedSvg }}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onToggleLogo}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-950/15 bg-white px-3 py-1 text-[11px] font-semibold text-amber-950 shadow-2xs transition hover:bg-amber-100/70 cursor-pointer"
          title="Alternar diseño con/sin logo central"
        >
          <span>Logo central: {includeLogo ? 'Activado' : 'Desactivado'}</span>
        </button>
      </div>

      {/* Información concisa */}
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-gris-700">
          Este código QR debe imprimirse y colocarse físicamente en{' '}
          <strong className="text-amber-950">{placeName}</strong>. Los turistas lo
          escanearán desde XíimbalApp para validar su visita.
        </p>

        {/* Token técnico */}
        <div className="rounded-2xl border border-amber-950/10 bg-amber-50/70 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-amber-950">
              Token de Verificación:
            </span>
            <button
              type="button"
              onClick={onCopyToken}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium text-amber-900 transition hover:bg-amber-200/60 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-success" />
                  <span className="text-success">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-1 font-mono text-[11px] break-all text-gris-600">
            {qrData.qr_value}
          </p>
          {formattedDate && (
            <div className="mt-2.5 flex items-center gap-1.5 border-t border-amber-950/10 pt-2 text-[11px] text-gris-500">
              <Calendar className="size-3.5 text-amber-700" />
              <span>Generado: {formattedDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
