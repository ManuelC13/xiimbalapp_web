import { generateQrMatrix } from '../core/qrModel.js'

/**
 * Genera el SVG completo personalizado para la identidad de XíimbalApp:
 * - Corrección de error nivel 'H' (30% de redundancia)
 * - Puntos de datos continuos en color de marca (#3b1d02)
 * - Ojos de enfoque con esquinas y centro sólido según norma ISO/IEC 18004
 * - Insignia circular blanca en el centro con el logo de la pirámide de XíimbalApp
 */
export function getXiimbalQrSvg({
  text,
  logoUrl = '/images/logo-amber-950.png',
  margin = 4,
  darkColor = '#3b1d02',
  accentColor = '#ffbf00',
  showLogo = true,
} = {}) {
  // Nivel H para permitir el logo central manteniendo 100% de redundancia Reed-Solomon
  const qr = generateQrMatrix(text, 'H')
  const count = qr.getModuleCount()
  const total = count + margin * 2
  const center = margin + count / 2
  // Tamaño óptimo del logo central: ~18% del ancho para máxima legibilidad
  const badgeRadius = showLogo ? Math.min(count * 0.11, 4) : 0
  const logoSize = badgeRadius * 1.3
  const logoOffset = center - logoSize / 2

  // Identificar si una celda pertenece a uno de los 3 ojos de enfoque (7x7)
  const isFinder = (r, c) =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= count - 7) ||
    (r >= count - 7 && c < 7)

  // Generar módulos de datos estándar continuos (omitiendo ojos y centro del logo)
  let dotsSvg = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c)) continue
      if (isFinder(r, c)) continue

      const x = margin + c + 0.5
      const y = margin + r + 0.5
      const distToCenter = Math.hypot(x - center, y - center)

      // Dejar espacio limpio para el logo central si está activo
      if (showLogo && distToCenter < badgeRadius + 0.4) continue

      // Módulo continuo y sólido
      dotsSvg += `<rect x="${margin + c}" y="${margin + r}" width="1.01" height="1.01" fill="${darkColor}"/>`
    }
  }

  // Genera los 3 ojos de enfoque
  const finderPositions = [
    { x: margin, y: margin },
    { x: margin + count - 7, y: margin },
    { x: margin, y: margin + count - 7 },
  ]

  let findersSvg = ''
  for (const pos of finderPositions) {
    // 7x7 marco exterior, 5x5 interior blanco, 3x3 centro sólido oscuro
    findersSvg += `
      <rect x="${pos.x}" y="${pos.y}" width="7" height="7" fill="${darkColor}"/>
      <rect x="${pos.x + 1}" y="${pos.y + 1}" width="5" height="5" fill="#ffffff"/>
      <rect x="${pos.x + 2}" y="${pos.y + 2}" width="3" height="3" fill="${darkColor}"/>
    `
  }

  // Insignia circular blanca en el centro con borde dorado y logo
  let centerBadgeSvg = ''
  if (showLogo && badgeRadius > 0) {
    centerBadgeSvg = `
      <circle cx="${center}" cy="${center}" r="${badgeRadius}" fill="#ffffff" stroke="${accentColor}" stroke-width="0.5"/>
      <image href="${logoUrl}" x="${logoOffset}" y="${logoOffset}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" onerror="this.style.display='none'"/>
    `
  }

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="100%" height="100%">
    <rect width="${total}" height="${total}" fill="#ffffff"/>
    <g class="qr-dots">${dotsSvg}</g>
    <g class="qr-finders">${findersSvg}</g>
    ${centerBadgeSvg ? `<g class="qr-badge">${centerBadgeSvg}</g>` : ''}
  </svg>`

  return {
    svg: fullSvg,
    total,
    count,
  }
}

/**
 * Renderiza el código QR personalizado en un elemento canvas para descargar PNG en alta resolución.
 */
export async function drawXiimbalQrToCanvas(
  canvas,
  text,
  {
    size = 1024,
    margin = 4,
    darkColor = '#3b1d02',
    accentColor = '#ffbf00',
    logoUrl = '/images/logo-amber-950.png',
    showLogo = true,
  } = {}
) {
  const qr = generateQrMatrix(text, 'H')
  const count = qr.getModuleCount()
  const total = count + margin * 2
  const cellSize = size / total
  const center = (margin + count / 2) * cellSize
  const badgeRadius = showLogo ? Math.min(count * 0.11, 4) * cellSize : 0
  const logoSize = badgeRadius * 1.3

  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Fondo blanco con zona de silencio
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  const isFinder = (r, c) =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= count - 7) ||
    (r >= count - 7 && c < 7)

  // Dibujar puntos de datos continuos y sin huecos
  ctx.fillStyle = darkColor
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c)) continue
      if (isFinder(r, c)) continue

      const px = (margin + c) * cellSize
      const py = (margin + r) * cellSize
      const cx = px + cellSize / 2
      const cy = py + cellSize / 2

      if (showLogo && Math.hypot(cx - center, cy - center) < badgeRadius + cellSize * 0.4) {
        continue
      }

      ctx.fillRect(
        Math.floor(px),
        Math.floor(py),
        Math.ceil(cellSize) + 1,
        Math.ceil(cellSize) + 1
      )
    }
  }

  // Dibujar ojos de enfoque
  const finderPositions = [
    { x: margin * cellSize, y: margin * cellSize },
    { x: (margin + count - 7) * cellSize, y: margin * cellSize },
    { x: margin * cellSize, y: (margin + count - 7) * cellSize },
  ]

  for (const pos of finderPositions) {
    // 7x7 marco exterior
    ctx.fillStyle = darkColor
    ctx.fillRect(pos.x, pos.y, cellSize * 7, cellSize * 7)

    // 5x5 interior blanco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(pos.x + cellSize, pos.y + cellSize, cellSize * 5, cellSize * 5)

    // 3x3 centro sólido oscuro
    ctx.fillStyle = darkColor
    ctx.fillRect(pos.x + cellSize * 2, pos.y + cellSize * 2, cellSize * 3, cellSize * 3)
  }

  // Insignia circular blanca en el centro con borde dorado y logo
  if (showLogo && badgeRadius > 0) {
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(center, center, badgeRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = accentColor
    ctx.lineWidth = Math.max(2, cellSize * 0.5)
    ctx.stroke()

    // Cargar y pintar el logo de XíimbalApp
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = logoUrl
      await new Promise((resolve) => {
        if (img.complete) resolve()
        else {
          img.onload = resolve
          img.onerror = resolve
        }
      })
      ctx.drawImage(
        img,
        center - logoSize / 2,
        center - logoSize / 2,
        logoSize,
        logoSize
      )
    } catch {
      // Continuar sin logo si hay error
    }
  }
}
