import { useEffect, useState } from "react";
import { fetchPixabayPhotos } from "./data/photo.js";
import GalleryHeader from "./components/GalleryHeader/GalleryHeader.jsx";
import GlassSkeleton from "./components/GlassSkeleton/GlassSkeleton.jsx";
import PhotoCard from "./components/PhotoCard/PhotoCard.jsx";
import PhotoLightbox from "./components/PhotoLightBox/PhotoLightBox.jsx";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hoveredPhotoId, setHoveredPhotoId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    let ignore = false;

    async function loadPhotos() {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      try {
        const apiPhotos = await fetchPixabayPhotos({
          category: selectedCategory,
          query: searchQuery,
          page,
          perPage: 24,
        });

        if (!ignore) {
          setPhotos((prev) => {
            if (page === 1) return apiPhotos;
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNew = apiPhotos.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...prev, ...uniqueNew];
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load photos");
          if (page === 1) setPhotos([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    loadPhotos();

    return () => {
      ignore = true;
    };
  }, [selectedCategory, searchQuery, page]);

  const isAnyHovered = hoveredPhotoId !== null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-50 to-slate-900 text-slate-900">
      {/* Soft Glass Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-20 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <GalleryHeader
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDimmed={isAnyHovered}
        />

        {loading && <GlassSkeleton />}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-red-100/70 backdrop-blur-xl border border-red-300/70 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <div className="my-12 p-8 text-center rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80">
            <p className="text-base font-medium text-slate-800">
              No photos matched your search
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try another keyword or reset the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-5 py-2 rounded-full bg-white/80 hover:bg-white text-slate-900 border border-white text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isHovered={hoveredPhotoId === photo.id}
              isDimmed={isAnyHovered && hoveredPhotoId !== photo.id}
              onHoverChange={setHoveredPhotoId}
              onSelect={() => {
                setHoveredPhotoId(null);
                setShowDetails(true);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>

        {/* Load More */}
        {photos.length > 0 && !loading && (
          <div
            className={`mt-10 flex flex-col items-center gap-2 transition-all duration-300 ${
              isAnyHovered ? "blur-md opacity-35" : "blur-0 opacity-100"
            }`}
          >
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loadingMore}
              className="px-7 py-2.5 rounded-full bg-white/50 hover:bg-white/80 text-slate-900 font-semibold text-sm backdrop-blur-xl border border-white/80 disabled:opacity-50 transition cursor-pointer shadow-sm"
            >
              {loadingMore ? "Loading more..." : "Load More Photos"}
            </button>
            <span className="text-xs text-slate-500">
              Page {page} · {photos.length} photos
            </span>
          </div>
        )}
      </main>

      <PhotoLightbox
        photos={photos}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        showDetails={showDetails}
        onToggleDetails={setShowDetails}
        onSelectTag={(tag) => setSearchQuery(tag)}
      />
    </div>
  );
}