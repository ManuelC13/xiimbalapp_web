import { getXiimbalQrSvg, drawXiimbalQrToCanvas } from '@/utils/qr'

/**
 * Escapa caracteres HTML para inyección segura en la plantilla de impresión.
 */
function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Genera la plantilla HTML completa para imprimir el cartel tamaño carta oficial de XíimbalApp.
 */
export function generateQrPosterHtml({ qrValue, placeName, townName, includeLogo = true }) {
  const safePlaceName = escapeHtml(placeName)
  const safeTownName = escapeHtml(townName)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const logoUrl = `${origin}/images/logo-amber-50.png`
  const centerQrLogo = `${origin}/images/logo-amber-950.png`

  const brandedQr = getXiimbalQrSvg({
    text: qrValue,
    logoUrl: centerQrLogo,
    margin: 4,
    darkColor: '#3b1d02',
    accentColor: '#ffbf00',
    showLogo: includeLogo,
  })

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cartel QR - ${safePlaceName}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #fffdea;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .poster-page {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fffdea;
    }
    .header {
      width: 100%;
      background-color: #482200;
      padding: 16px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-img {
      height: 38px;
      width: 38px;
      object-fit: contain;
    }
    .logo-text {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .header-tagline {
      font-size: 13px;
      font-weight: 700;
      color: #ffbf00;
      letter-spacing: 0.2px;
    }
    .main-content {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 32px 18px 32px;
    }
    .title {
      font-size: 42px;
      font-weight: 900;
      color: #482200;
      letter-spacing: -1px;
      margin-bottom: 14px;
      text-align: center;
      line-height: 1.1;
    }
    .place-pill {
      display: inline-block;
      background-color: #ffbf00;
      color: #482200;
      font-size: 24px;
      font-weight: 900;
      padding: 8px 38px;
      border-radius: 9999px;
      margin-bottom: 12px;
      text-align: center;
    }
    .town-subtitle {
      font-size: 15px;
      font-weight: 700;
      color: #482200;
      margin-bottom: 20px;
      text-align: center;
    }
    .qr-card {
      background-color: #ffffff;
      border: 4.5px solid #482200;
      border-radius: 36px;
      padding: 22px;
      margin-bottom: 14px;
      box-shadow: 0 4px 16px rgba(72, 34, 0, 0.08);
    }
    .qr-card svg {
      display: block;
      width: 280px;
      height: 280px;
    }
    .scan-hint-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 22px;
    }
    .yellow-line {
      width: 32px;
      height: 4px;
      background-color: #ffbf00;
      border-radius: 99px;
    }
    .scan-hint-text {
      font-size: 13.5px;
      font-weight: 800;
      color: #482200;
    }
    .instructions-card {
      width: 100%;
      max-width: 580px;
      background-color: #ffffff;
      border: 2px solid #482200;
      border-radius: 24px;
      padding: 18px 24px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      box-shadow: 0 2px 10px rgba(72, 34, 0, 0.04);
    }
    .instruction-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .step-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #482200;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      margin-bottom: 8px;
      line-height: 30px;
    }
    .step-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #482200;
      margin-bottom: 4px;
    }
    .step-desc {
      font-size: 11px;
      font-weight: 500;
      color: #6b6b6b;
      line-height: 1.35;
    }
    .footer {
      width: 100%;
      background-color: #482200;
      color: #ffffff;
      padding: 14px 20px;
      text-align: center;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
  </style>
</head>
<body>
  <div class="poster-page">
    <div class="header">
      <div class="logo-group">
        <img src="${logoUrl}" class="logo-img" alt="Logo XíimbalApp" onerror="this.style.display='none'" />
        <span class="logo-text">XíimbalApp</span>
      </div>
      <div class="header-tagline">Descubre los Pueblos Mágicos de Yucatán</div>
    </div>

    <div class="main-content">
      <div class="title">¡Registra tu visita!</div>
      <div class="place-pill">${safePlaceName}</div>
      <div class="town-subtitle">${safeTownName ? `Pueblo Mágico de ${safeTownName}` : 'Pueblo Mágico'}</div>

      <div class="qr-card">
        ${brandedQr.svg}
      </div>

      <div class="scan-hint-row">
        <div class="yellow-line"></div>
        <div class="scan-hint-text">Apunta tu cámara aquí con XíimbalApp</div>
        <div class="yellow-line"></div>
      </div>

      <div class="instructions-card">
        <div class="instruction-item">
          <div class="step-circle">1</div>
          <div class="step-title">Abre la app</div>
          <div class="step-desc">Ingresa a XíimbalApp en tu teléfono</div>
        </div>
        <div class="instruction-item">
          <div class="step-circle">2</div>
          <div class="step-title">Escanea el QR</div>
          <div class="step-desc">Toca «Registrar visita» y enfoca este código</div>
        </div>
        <div class="instruction-item">
          <div class="step-circle">3</div>
          <div class="step-title">¡Valida tu visita!</div>
          <div class="step-desc">Suma puntos, retos e insignias</div>
        </div>
      </div>
    </div>

    <div class="footer">
      Código oficial de validación turística
    </div>
  </div>
</body>
</html>`
}

/**
 * Dispara la impresión silenciosa y limpia del cartel mediante un iframe aislado.
 */
export function printQrPoster({ qrValue, placeName, townName, includeLogo = true }) {
  if (!qrValue || typeof window === 'undefined') return

  const printHtml = generateQrPosterHtml({ qrValue, placeName, townName, includeLogo })
  const logoUrl = `${window.location.origin}/images/logo-amber-50.png`

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow.document
  doc.open()
  doc.write(printHtml)
  doc.close()

  // Pre-cargar la imagen del logo antes de disparar el print
  const preImg = new Image()
  preImg.src = logoUrl

  const triggerPrint = () => {
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
    setTimeout(() => {
      if (document.body && document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
    }, 1500)
  }

  if (preImg.complete) {
    setTimeout(triggerPrint, 200)
  } else {
    preImg.onload = () => setTimeout(triggerPrint, 200)
    preImg.onerror = () => setTimeout(triggerPrint, 200)
  }
}

/**
 * Renderiza el código QR en un canvas a alta resolución y lo descarga como archivo PNG.
 */
export async function downloadQrPng({ qrValue, placeName = 'lugar', includeLogo = true }) {
  if (!qrValue || typeof window === 'undefined') return

  const canvas = document.createElement('canvas')
  await drawXiimbalQrToCanvas(canvas, qrValue, {
    size: 1024,
    margin: 4,
    darkColor: '#3b1d02',
    accentColor: '#ffbf00',
    logoUrl: `${window.location.origin}/images/logo-amber-950.png`,
    showLogo: includeLogo,
  })

  const link = document.createElement('a')
  const safeName = (placeName || 'lugar').toLowerCase().replace(/[^a-z0-9]/g, '_')
  link.download = `QR_Xiimbal_${safeName}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
