const SKELETON_HEIGHTS = [240, 320, 200, 290, 260, 340, 220, 280];

export default function GlassSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5 mb-8">
      {SKELETON_HEIGHTS.map((height, idx) => (
        <div
          key={idx}
          style={{ height: `${height}px` }}
          className="break-inside-avoid rounded-2xl bg-white/40 backdrop-blur-xl border border-white/75 shadow-sm animate-pulse"
        />
      ))}
    </div>
  );
}