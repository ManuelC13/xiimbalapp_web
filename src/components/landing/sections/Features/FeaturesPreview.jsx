// Maquetas que se muestran dentro del teléfono mientras no exista la captura real de cada funcionalidad

function MapPreview() {
  const dots = ['left-[18%] top-[16%]', 'left-[52%] top-[10%]', 'left-[68%] top-[40%]', 'left-[30%] top-[48%]', 'left-[58%] top-[66%]']
  return (
    <div className="h-full bg-amber-50 p-3">
      <div className="relative h-[72%] rounded-2xl bg-amber-200/80">
        {dots.map((position) => (
          <span key={position} className={`absolute size-4 rounded-full border-2 border-white bg-amber-700 ${position}`} />
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-white p-3">
        <p className="text-sm font-extrabold">Catedral de San Servacio</p>
        <p className="text-xs text-amber-800">Abierto · Cierra 9:38 p.m.</p>
      </div>
    </div>
  )
}

function DetailsPreview() {
  return (
    <div className="h-full bg-amber-50 p-3">
      <div className="h-[34%] rounded-2xl bg-linear-to-br from-amber-200 to-amber-500" />
      <p className="mt-3 text-sm font-extrabold">Convento de San Bernardino</p>
      <div className="mt-1.5 flex gap-1.5 text-[10px] font-bold">
        <span className="rounded-full bg-amber-500 px-2 py-0.5">Abierto</span>
        <span className="rounded-full border border-amber-500 px-2 py-0.5 font-medium">Cierra 6:00 p.m.</span>
      </div>
      <p className="mt-3 text-[11px] font-extrabold">Historia</p>
      <div className="mt-1.5 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-amber-200" />
        <div className="h-1.5 w-11/12 rounded bg-amber-200" />
        <div className="h-1.5 w-4/5 rounded bg-amber-200" />
      </div>
      <p className="mt-3 text-[11px] font-extrabold">Cerca de aquí</p>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        <div className="aspect-square rounded-xl bg-amber-200" />
        <div className="aspect-square rounded-xl bg-amber-300" />
        <div className="aspect-square rounded-xl bg-amber-200" />
      </div>
    </div>
  )
}

function ChallengesPreview() {
  const items = [
    ['Vuelta por Espita', 'Registra 3 visitas'],
    ['Fan de las malteadas', 'Compra 2 malteadas'],
    ['Vuelta por Izamal', 'Registra 3 visitas'],
    ['Fan de los helados', 'Compra 2 helados'],
  ]
  return (
    <div className="h-full bg-amber-50 p-4">
      <p className="text-sm font-extrabold">Retos y recompensas</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
        <span className="rounded-full bg-amber-500 py-1.5">Retos activos</span>
        <span className="rounded-full border border-amber-500 py-1.5 font-medium">Mis insignias</span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map(([title, text]) => (
          <div key={title + text} className="flex items-center justify-between rounded-2xl border-2 border-amber-500 bg-white px-3 py-2">
            <div>
              <p className="text-xs font-extrabold">{title}</p>
              <p className="text-[10px] text-amber-800">{text}</p>
            </div>
            <span className="size-5 rounded-full bg-amber-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

function BadgesPreview() {
  const badges = [
    ['bg-amber-100', 'bg-amber-300'],
    ['bg-amber-100', 'bg-amber-700'],
    ['bg-amber-100', 'bg-amber-300'],
    ['bg-amber-100', 'bg-amber-700'],
    ['bg-amber-100', 'bg-amber-300'],
    ['bg-gray-200', 'bg-gray-400'],
  ]
  return (
    <div className="h-full bg-amber-50 p-4">
      <p className="text-sm font-extrabold">Retos y recompensas</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
        <span className="rounded-full border border-amber-500 py-1.5 font-medium">Retos activos</span>
        <span className="rounded-full bg-amber-500 py-1.5">Mis insignias</span>
      </div>
      <p className="mt-4 text-center text-[10px] font-bold text-gray-500">Obtenidas</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {badges.map(([card, circle], index) => (
          <div key={index} className={`flex aspect-square items-center justify-center rounded-2xl ${card}`}>
            <span className={`size-1/2 rounded-full ${circle}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const PREVIEWS = {
  map: MapPreview,
  details: DetailsPreview,
  challenges: ChallengesPreview,
  badges: BadgesPreview,
}