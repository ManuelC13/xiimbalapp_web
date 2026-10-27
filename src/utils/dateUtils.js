/**
 * Utilidades para el manejo y formateo de fechas y horas en la aplicación.
 */

/**
 * @param {string|Date|number} dateValue
 * @returns {Date|null}
 */
export function parseUtcDate(dateValue) {
  if (!dateValue) return null
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue
  }

  if (typeof dateValue === 'string') {
    const trimmed = dateValue.trim()
    if (!trimmed) return null

    const hasTz =
      trimmed.endsWith('Z') ||
      trimmed.endsWith('z') ||
      /[+-]\d{2}(:\d{2})?$/.test(trimmed)

    const normalized = hasTz ? trimmed : `${trimmed}Z`
    const parsed = new Date(normalized)
    return isNaN(parsed.getTime()) ? null : parsed
  }

  const d = new Date(dateValue)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Formatea una fecha UTC a cadena legible en español (es-MX) en la zona horaria local.
 *
 * @param {string|Date|number} dateValue
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string|null}
 */
export function formatUtcDateTime(dateValue, options = {}) {
  const d = parseUtcDate(dateValue)
  if (!d) return null

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }

  return d.toLocaleDateString('es-MX', defaultOptions)
}
