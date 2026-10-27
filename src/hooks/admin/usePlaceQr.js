import { useState, useEffect, useCallback } from 'react'
import { getPlaceActiveQr, createPlaceQr, revokePlaceQr } from '@/api/places'
import { downloadQrPng, printQrPoster } from '@/utils/qrPosterUtils'

/**
 * Hook para gestionar el ciclo de vida, acciones de generación/revocación
 * y exportación (PNG / Impresión) del código QR de un lugar.
 */
export function usePlaceQr({ isOpen, place, townName }) {
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false)
  const [showConfirmRevoke, setShowConfirmRevoke] = useState(false)
  const [includeLogo, setIncludeLogo] = useState(true)

  // Cargar el QR activo cuando se abre el modal
  useEffect(() => {
    if (!isOpen || !place?.place_id) {
      setQrData(null)
      setError('')
      setSuccess('')
      setShowConfirmRegenerate(false)
      setShowConfirmRevoke(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError('')
    setSuccess('')

    getPlaceActiveQr(place.place_id)
      .then((data) => {
        if (isMounted) {
          setQrData(data || null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Error al consultar el código QR del lugar')
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, place?.place_id])

  // Manejar generación de nuevo QR
  const handleGenerateQr = useCallback(async () => {
    if (!place?.place_id) return
    setActionLoading(true)
    setError('')
    setSuccess('')
    try {
      const data = await createPlaceQr(place.place_id)
      setQrData(data)
      setShowConfirmRegenerate(false)
      setSuccess('¡Código QR generado con éxito!')
    } catch (err) {
      setError(err?.message || 'No se pudo generar el código QR')
    } finally {
      setActionLoading(false)
    }
  }, [place?.place_id])

  // Manejar revocación de QR
  const handleRevokeQr = useCallback(async () => {
    if (!qrData?.qr_id) return
    setActionLoading(true)
    setError('')
    setSuccess('')
    try {
      await revokePlaceQr(qrData.qr_id)
      setQrData(null)
      setShowConfirmRevoke(false)
      setSuccess('El código QR fue revocado correctamente.')
    } catch (err) {
      setError(err?.message || 'No se pudo revocar el código QR')
    } finally {
      setActionLoading(false)
    }
  }, [qrData?.qr_id])

  // Copiar token
  const handleCopyToken = useCallback(() => {
    if (!qrData?.qr_value) return
    navigator.clipboard.writeText(qrData.qr_value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }, [qrData?.qr_value])

  // Descargar como PNG
  const handleDownloadPng = useCallback(() => {
    if (!qrData?.qr_value) return
    downloadQrPng({
      qrValue: qrData.qr_value,
      placeName: place?.name,
      includeLogo,
    })
  }, [qrData?.qr_value, place?.name, includeLogo])

  // Imprimir letrero oficial
  const handlePrint = useCallback(() => {
    if (!qrData?.qr_value) return
    printQrPoster({
      qrValue: qrData.qr_value,
      placeName: place?.name,
      townName,
      includeLogo,
    })
  }, [qrData?.qr_value, place?.name, townName, includeLogo])

  const toggleIncludeLogo = useCallback(() => {
    setIncludeLogo((prev) => !prev)
  }, [])

  return {
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
    setIncludeLogo,
    toggleIncludeLogo,
    setError,
    setSuccess,
    handleGenerateQr,
    handleRevokeQr,
    handleCopyToken,
    handleDownloadPng,
    handlePrint,
  }
}
