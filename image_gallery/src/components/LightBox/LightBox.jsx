import { useEffect } from "react";

export default function LightboxModal({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) {
  const isOpen = currentIndex !== null && photos.length > 0;
  const photo = isOpen ? photos[currentIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
    >
      {/* Container يمنع قفل المودال لما تدوسي على الصورة نفسها */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">
              {photo.title}
            </h2>
            <p className="text-xs text-neutral-400 truncate">
              {photo.category} · by {photo.photographer}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Image Viewer + Prev / Next */}
        <div className="relative flex items-center justify-center bg-neutral-950 p-3 sm:p-6">
          <button
            onClick={onPrev}
            aria-label="Previous photo"
            className="absolute left-3 z-10 w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-amber-500 hover:text-neutral-950 text-white border border-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            ‹
          </button>

          <img
            src={photo.src}
            alt={photo.alt}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
          />

          <button
            onClick={onNext}
            aria-label="Next photo"
            className="absolute right-3 z-10 w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-amber-500 hover:text-neutral-950 text-white border border-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            ›
          </button>
        </div>

        {/* Footer Counter */}
        <div className="px-4 py-2.5 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Use ← / → or Esc keys</span>
          <span>
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </div>
    </div>
  );
}