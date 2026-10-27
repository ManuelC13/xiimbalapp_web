import { generateQrMatrix } from '../core/qrModel.js'

/**
 * Convierte un texto a ruta SVG genérica (compatibilidad).
 */
export function getQrSvgPath(text, errorLevel = 'M') {
  const qr = generateQrMatrix(text, errorLevel)
  const count = qr.getModuleCount()
  let d = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        d += `M${c},${r}h1v1h-1z `
      }
    }
  }
  return { path: d, count }
}

/**
 * Renderiza el código QR estándar en un elemento canvas a la resolución deseada.
 */
export function drawQrToCanvas(canvas, text, { size = 512, margin = 2, dark = '#1c1917', light = '#ffffff' } = {}) {
  const qr = generateQrMatrix(text, 'M')
  const count = qr.getModuleCount()
  const totalCount = count + margin * 2
  const cellSize = size / totalCount

  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = light
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = dark
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(
          Math.round((c + margin) * cellSize),
          Math.round((r + margin) * cellSize),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        )
      }
    }
  }
}
