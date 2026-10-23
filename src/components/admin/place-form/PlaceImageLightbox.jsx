import { X } from 'lucide-react'

export default function PlaceImageLightbox({ imageUrl, onClose }) {
  if (!imageUrl) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-amber-950 p-2 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
        >
          <X className="size-5" />
        </button>
        <img
          src={imageUrl}
          alt="Fotografía"
          className="max-h-[85vh] w-auto rounded-2xl object-contain"
        />
      </div>
    </div>
  )
}
