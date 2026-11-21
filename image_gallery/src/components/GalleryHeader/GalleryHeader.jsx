import { CATEGORIES } from "../../data/photo.js";

export default function GalleryHeader({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isDimmed,
}) {
  return (
    <header
      className={`mb-8 space-y-4 transition-all duration-300 ${
        isDimmed
          ? "blur-md opacity-35 pointer-events-none select-none"
          : "blur-0 opacity-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90"> 
          Alpha Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Welcome to the gallery — keep scrolling, keep discovering.
          </p>
        </div>

        {/* Transparent Glass Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search photos..."
            className="w-full px-4 py-2.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/80 shadow-sm text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:bg-white/70 focus:border-slate-400/60 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Transparent Glass Categories */}
      <nav aria-label="Photo categories" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm backdrop-blur-xl border transition-all duration-500 cursor-pointer ${
                isActive
                  ? "bg-white text-slate-950 font-semibold border-white shadow-sm transition-all duration-300"
                  : "bg-white/70 text-slate-700 border-white/70 hover:bg-white/65 hover:text-slate-950 transition-all duration-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>
    </header>
  );
}