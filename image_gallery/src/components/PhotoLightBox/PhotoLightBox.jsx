import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function PhotoLightbox({
  photos,
  activeIndex,
  onClose,
  showDetails,
  onToggleDetails,
  onSelectTag,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadToast, setDownloadToast] = useState("");

  const slides = photos.map((photo) => ({
    src: photo.src,
    alt: photo.alt,
    title: photo.title,
  }));

  const currentPhoto =
    activeIndex !== null && photos[activeIndex] ? photos[activeIndex] : null;

  function notifyDownload(message) {
    setDownloadToast(message);
    setTimeout(() => {
      setDownloadToast((prev) => (prev === message ? "" : prev));
    }, 2500);
  }

  async function handleDownload(photo) {
    if (!photo?.src || downloading) return;
    setDownloading(true);

    try {
      const response = await fetch(photo.src);
      if (!response.ok) throw new Error("Network error");

      const blob = await response.blob();
      const extension = blob.type.split("/")[1]?.split("+")[0] || "jpg";
      const safeName = (photo.title || `photo-${photo.id}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${safeName || "alpha-gallery"}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);

      notifyDownload("");
    } catch {
      window.open(photo.src, "_blank", "noopener,noreferrer");
      notifyDownload("");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <Lightbox
        open={activeIndex !== null}
        close={onClose}
        index={activeIndex ?? 0}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        styles={{
          container: {
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          },
        }}
        render={{
          slideFooter: () => {
            if (!currentPhoto) return null;

            if (!showDetails) {
              return (
                <div className="flex justify-center mb-5">
                  <button
                    type="button"
                    onClick={() => onToggleDetails(true)}
                    className="px-4 py-1.5 rounded-full text-xs bg-white/75 hover:bg-white backdrop-blur-xl border border-white text-slate-900 cursor-pointer shadow-sm"
                  >
                    Show details
                  </button>
                </div>
              );
            }

            return (
              <div className="w-full max-w-2xl mx-auto mb-4 px-4">
                <div className="rounded-2xl bg-white/25 backdrop-blur-2xl border border-white p-4 text-slate-900 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold truncate">
                        {currentPhoto.title}
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Created by{" "}
                        <span className="font-medium text-slate-950">
                          {currentPhoto.photographer}
                        </span>{" "}
                        · <span>{currentPhoto.category}</span>
                        {currentPhoto.width && currentPhoto.height && (
                          <span>
                            {" "}
                            · {currentPhoto.width} × {currentPhoto.height}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownload(currentPhoto)}
                        disabled={downloading}
                        className="text-xs px-3 py-1 rounded-lg bg-white/85 hover:bg-white text-slate-900 font-medium border border-white disabled:opacity-50 transition cursor-pointer"
                      >
                        {downloading ? "Saving..." : "Download"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleDetails(false)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-slate-800 border border-white transition cursor-pointer"
                      >
                        Hide
                      </button>
                    </div>
                  </div>

                  {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {currentPhoto.tags.slice(0, 5).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            onSelectTag(tag);
                            onClose();
                          }}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-white/70 hover:bg-white text-slate-800 border border-white transition cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          },
        }}
      />

      {downloadToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-white text-slate-900 text-xs sm:text-sm font-medium shadow-lg">
            {downloadToast}
          </div>
        </div>
      )}
    </>
  );
}