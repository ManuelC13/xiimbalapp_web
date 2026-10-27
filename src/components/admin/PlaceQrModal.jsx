import { AlertTriangle, Check, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'
import { usePlaceQr } from '@/hooks/admin'
import {
  PlaceQrHeader,
  PlaceQrActiveCard,
  PlaceQrActions,
  PlaceQrEmptyState,
  PlaceQrConfirmations,
} from './place-qr'

export default function PlaceQrModal({ isOpen, place, townName, onClose }) {
  const {
    loading,
    actionLoading,
    qrData,
    error,
    success,
    copied,
    includeLogo,
    showConfirmRegenerate,
    showConfirmRevoke,
    setShowConfirmRegenerate,
    setShowConfirmRevoke,
    toggleIncludeLogo,
    handleGenerateQr,
    handleRevokeQr,
    handleCopyToken,
    handleDownloadPng,
    handlePrint,
  } = usePlaceQr({ isOpen, place, townName })

  if (!isOpen || !place) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-amber-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-amber-800/30 bg-white shadow-2xl">
        {/* Header */}
        <PlaceQrHeader
          placeName={place.name}
          townName={townName}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
              <AlertTriangle className="size-5 shrink-0" />
              <p className="flex-1">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-success-light p-4 text-sm font-semibold text-success">
              <Check className="size-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <RefreshCw className="size-10 animate-spin text-amber-800" />
              <p className="mt-4 text-sm font-semibold text-amber-950">
                Consultando código QR...
              </p>
            </div>
          ) : qrData ? (
            <div className="space-y-6">
              <PlaceQrActiveCard
                placeName={place.name}
                qrData={qrData}
                includeLogo={includeLogo}
                onToggleLogo={toggleIncludeLogo}
                copied={copied}
                onCopyToken={handleCopyToken}
              />

              <PlaceQrActions
                onOpenRevoke={() => {
                  setShowConfirmRegenerate(false)
                  setShowConfirmRevoke(true)
                }}
                onOpenRegenerate={() => {
                  setShowConfirmRevoke(false)
                  setShowConfirmRegenerate(true)
                }}
                onDownloadPng={handleDownloadPng}
                onPrint={handlePrint}
              />
            </div>
          ) : (
            <PlaceQrEmptyState
              actionLoading={actionLoading}
              onGenerateQr={handleGenerateQr}
            />
          )}

          {/* Diálogos de confirmación para Regenerar / Revocar */}
          <PlaceQrConfirmations
            placeName={place.name}
            actionLoading={actionLoading}
            showConfirmRegenerate={showConfirmRegenerate}
            showConfirmRevoke={showConfirmRevoke}
            onCancelRegenerate={() => setShowConfirmRegenerate(false)}
            onConfirmRegenerate={handleGenerateQr}
            onCancelRevoke={() => setShowConfirmRevoke(false)}
            onConfirmRevoke={handleRevokeQr}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-amber-950/10 bg-amber-50/50 px-6 py-4 sm:px-8">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
