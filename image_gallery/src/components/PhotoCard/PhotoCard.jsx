export default function PhotoCard({
  photo,
  isHovered,
  isDimmed,
  onHoverChange,
  onSelect,
}) {
  return (
    <article
      onMouseEnter={() => onHoverChange(photo.id)}
      onMouseLeave={() => onHoverChange(null)}
      onClick={onSelect}
      className={`break-inside-avoid group relative rounded-2xl overflow-hidden bg-white/30 backdrop-blur-md border transition-all duration-500 cursor-pointer ${
        isHovered
          ? "z-30 blur-0 opacity-100 border-white shadow-2xl scale-[1.03]"
          : isDimmed
          ? "z-10 blur-md opacity-40 border-white/50 scale-[0.98]"
          : "z-10 blur-0 opacity-100 border-white/75 shadow-sm"
      }`}
    >
      {/* Full Sharp Photo */}
      <img
        src={photo.thumb}
        alt={photo.alt}
        loading="lazy"
        className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />

      {/* Slide-Up Glass Info from Bottom to Top on Hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-3.5 bg-white/25 backdrop-blur-xl border-t border-white/45 shadow-inner text-slate-950">
        <p className="font-semibold text-sm truncate">{photo.title}</p>
        <p className="text-xs text-slate-800 mt-0.5 truncate">
          Created by{" "}
          <span className="font-semibold text-slate-950">
            {photo.photographer}
          </span>
        </p>
        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-xl bg-white/25 text-slate-900 border-t border-white/90">
          {photo.category}
        </span>
      </div>
    </article>
  );
}