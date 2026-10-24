import { Send, RefreshCw, Radio, Users, Search, AlertCircle, CheckCircle2, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotificationComposer({
  title,
  setTitle,
  body,
  setBody,
  screen,
  setScreen,
  screens,
  places,
  selectedPlaceId,
  setSelectedPlaceId,
  targetType,
  setTargetType,
  selectedUserIds,
  toggleUserSelection,
  selectAllFilteredUsers,
  clearSelectedUsers,
  userSearch,
  setUserSearch,
  filteredUsers,
  fieldErrors = {},
  alert = null,
  onDismissAlert = null,
  sending,
  onSubmit,
}) {
  return (
    <div className="rounded-3xl border border-gris-100 bg-white p-6 shadow-sm sm:p-8 space-y-6">
      {/* Título de la notificación */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-amber-950">
            Título del Mensaje <span className="text-amber-600">*</span>
          </label>
          <span className="text-xs font-medium text-gris-400">{title.length}/150</span>
        </div>
        <input
          type="text"
          maxLength={150}
          placeholder="Ej. ¡Descubre nuevos tesoros en Izamal!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm text-amber-950 outline-none transition ${
            fieldErrors.title
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-200'
              : 'border-gris-100 focus:border-amber-600 focus:ring-2 focus:ring-amber-300'
          }`}
        />
        {fieldErrors.title && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-error mt-1">
            <AlertCircle className="size-3.5 shrink-0" />
            {fieldErrors.title}
          </p>
        )}
      </div>

      {/* Cuerpo del mensaje */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-amber-950">
            Cuerpo del Mensaje <span className="text-amber-600">*</span>
          </label>
          <span className="text-xs font-medium text-gris-400">{body.length}/500</span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          placeholder="Escribe el mensaje que recibirán los usuarios en su celular..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={`w-full resize-none rounded-2xl border bg-white p-4 text-sm text-amber-950 outline-none transition ${
            fieldErrors.body
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-200'
              : 'border-gris-100 focus:border-amber-600 focus:ring-2 focus:ring-amber-300'
          }`}
        />
        {fieldErrors.body && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-error mt-1">
            <AlertCircle className="size-3.5 shrink-0" />
            {fieldErrors.body}
          </p>
        )}
      </div>

      {/* Pantalla Destino al Abrir */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-amber-950">
          Pantalla Destino al Abrir la Notificación
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {screens.map((sc) => {
            const Icon = sc.icon
            const isSelected = screen === sc.id
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setScreen(sc.id)}
                className={`flex flex-col items-start gap-1 rounded-2xl p-3.5 text-left transition cursor-pointer border ${
                  isSelected
                    ? 'border-amber-950 bg-amber-950 text-white shadow-sm'
                    : 'border-gris-100 bg-white text-amber-950 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${isSelected ? 'text-amber-300' : 'text-amber-800'}`} />
                  <span className="text-xs font-bold">{sc.label}</span>
                </div>
                <span
                  className={`text-[11px] leading-tight ${
                    isSelected ? 'text-amber-200' : 'text-gris-700'
                  }`}
                >
                  {sc.desc}
                </span>
              </button>
            )
          })}
        </div>

        {/* Lugar específico si seleccionó 'place' */}
        {screen === 'place' && (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-2">
            <label className="text-xs font-bold text-amber-950">
              Selecciona el Lugar al que redirigir: <span className="text-amber-600">*</span>
            </label>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-amber-950 outline-none transition ${
                fieldErrors.place
                  ? 'border-error focus:border-error focus:ring-2 focus:ring-red-200'
                  : 'border-gris-100 focus:border-amber-600 focus:ring-2 focus:ring-amber-300'
              }`}
            >
              <option value="">-- Elige un lugar turístico --</option>
              {places.map((p) => {
                const name = p.name || p.place_name || `Lugar #${p.place_id}`
                const town = p.magical_town?.name || p.magical_town?.magical_town_name || ''
                return (
                  <option key={p.place_id} value={p.place_id}>
                    {name} {town ? `(${town})` : ''}
                  </option>
                )
              })}
            </select>
            {fieldErrors.place && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-error mt-1">
                <AlertCircle className="size-3.5 shrink-0" />
                {fieldErrors.place}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Segmentación de Audiencia */}
      <div className="space-y-3 pt-4 border-t border-gris-100">
        <label className="text-sm font-bold text-amber-950">Audiencia Destino</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTargetType('broadcast')}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition cursor-pointer ${
              targetType === 'broadcast'
                ? 'border-amber-950 bg-amber-950 text-white shadow-sm'
                : 'border-gris-100 bg-white text-amber-950 hover:bg-amber-100'
            }`}
          >
            <Radio
              className={`size-5 mt-0.5 shrink-0 ${
                targetType === 'broadcast' ? 'text-amber-300' : 'text-amber-800'
              }`}
            />
            <div>
              <p className="text-sm font-bold">Todos los Usuarios</p>
              <p
                className={`text-xs mt-0.5 ${
                  targetType === 'broadcast' ? 'text-amber-200' : 'text-gris-700'
                }`}
              >
                Difusión masiva a todos los dispositivos registrados con la app.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTargetType('specific')}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition cursor-pointer ${
              targetType === 'specific'
                ? 'border-amber-950 bg-amber-950 text-white shadow-sm'
                : 'border-gris-100 bg-white text-amber-950 hover:bg-amber-100'
            }`}
          >
            <Users
              className={`size-5 mt-0.5 shrink-0 ${
                targetType === 'specific' ? 'text-amber-300' : 'text-amber-800'
              }`}
            />
            <div>
              <p className="text-sm font-bold">Usuarios Específicos</p>
              <p
                className={`text-xs mt-0.5 ${
                  targetType === 'specific' ? 'text-amber-200' : 'text-gris-700'
                }`}
              >
                {selectedUserIds.length > 0
                  ? `${selectedUserIds.length} usuario(s) seleccionado(s)`
                  : 'Selecciona usuarios individuales de la lista.'}
              </p>
            </div>
          </button>
        </div>

        {/* Buscador y lista de usuarios */}
        {targetType === 'specific' && (
          <div className="mt-4 rounded-2xl border border-gris-100 bg-amber-50/40 p-4 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gris-400" />
                <input
                  type="search"
                  placeholder="Buscar por nombre o correo..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gris-100 bg-white pl-9 pr-3 text-xs text-amber-950 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllFilteredUsers}
                  className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-200 cursor-pointer transition"
                >
                  Seleccionar visibles
                </button>
                {selectedUserIds.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSelectedUsers}
                    className="rounded-full border border-gris-100 bg-white px-3 py-1.5 text-xs font-semibold text-gris-700 hover:bg-amber-100 cursor-pointer transition"
                  >
                    Limpiar ({selectedUserIds.length})
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-gris-100 bg-white divide-y divide-gris-100">
              {filteredUsers.length === 0 ? (
                <p className="p-4 text-center text-xs text-gris-400">No se encontraron usuarios</p>
              ) : (
                filteredUsers.map((u) => {
                  const isChecked = selectedUserIds.includes(u.user_id)
                  const fullName =
                    `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Usuario sin nombre'
                  return (
                    <label
                      key={u.user_id}
                      className="flex items-center justify-between p-2.5 hover:bg-amber-50 cursor-pointer transition text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleUserSelection(u.user_id)}
                          className="size-4 rounded text-amber-900 focus:ring-amber-500 cursor-pointer"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-amber-950 truncate">{fullName}</p>
                          <p className="text-[11px] text-gris-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] text-gris-400 font-mono">
                        #{u.user_id}
                      </span>
                    </label>
                  )
                })
              )}
            </div>

            {fieldErrors.audience && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-error mt-1">
                <AlertCircle className="size-3.5 shrink-0" />
                {fieldErrors.audience}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Alerta general del servidor (éxito o error de envío) colocada justo sobre el botón */}
      {alert && (
        <div
          className={`flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-sm transition ${
            alert.type === 'success'
              ? 'border-success/30 bg-success-light text-success'
              : 'border-border-error bg-background-error text-error'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {alert.type === 'success' ? (
              <CheckCircle2 className="size-5 shrink-0" />
            ) : (
              <AlertCircle className="size-5 shrink-0" />
            )}
            <p className="text-sm font-semibold">{alert.message}</p>
          </div>
          {onDismissAlert && (
            <button
              type="button"
              onClick={onDismissAlert}
              className="rounded-lg p-1 text-current opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {/* Botón de Enviar Notificación */}
      <div className="pt-2">
        <Button
          onClick={onSubmit}
          disabled={sending}
          size="md"
          className="w-full shadow-sm"
        >
          {sending ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              Enviando Notificación...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Enviar Notificación Push
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
