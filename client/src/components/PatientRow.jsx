// client/src/components/PatientRow.jsx

export default function PatientRow({ images, onSelect }) {
  if (!images || images.length === 0) return null;

  // gather all meta objects
  const metas = images.map((img) => img.meta || {});

  // --- compute summary across 5 images ---
  const maxBlobs = Math.max(
    ...metas.map((m) =>
      typeof m.counts?.blobs === "number" ? m.counts.blobs : 0
    )
  );

  // find most recent image by createdAt (if available) or meta.date
  const sortedByDate = images
    .map((img) => ({
      ...img,
      _d: Date.parse(img.meta?.date || img.createdAt || 0),
    }))
    .filter((i) => !isNaN(i._d))
    .sort((a, b) => a._d - b._d); // ASCENDING → earliest first

const first = sortedByDate[0]; // this is the FIRST image captured
const firstMeta = first?.meta || {};

const firstDate =
  firstMeta.date ||
  (first?.createdAt
    ? new Date(first.createdAt).toLocaleDateString()
    : "—");

const firstHex = firstMeta.center_pixel?.hex || "—";

const patientLabel =
  firstMeta.patient && firstMeta.patient !== "Unknown"
    ? firstMeta.patient
    : "Medical Client";

  return (
    <div className="flex items-start gap-6 my-8">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 shadow-md rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-3">
  {patientLabel}
</h2>


        <p className="text-sm text-gray-700 dark:text-gray-300">
          Number of Detected Spots:{" "}
          <span className="font-semibold text-sky-700">{maxBlobs}</span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Capture Date: <span className="font-mono">{firstDate}</span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Center HEX :{" "}
          <span className="font-mono">{firstHex}</span>
        </p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-6 gap-6 flex-1">


        {images.map((img) => (

          <button
            key={img._id}
            onClick={() => onSelect?.(img._id)}
            className="text-left"
            title="View details"
          >
<article
  className="relative overflow-hidden rounded-2xl bg-white shadow-lg outline outline-black/5 transition-transform duration-300 hover:scale-105 hover:shadow-2xl dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 group"
  onClick={() => onSelect?.(img._id)}
>
  {/* Image */}
  <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
    <img
      src={img.url}
      alt={img.public_id}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  </div>

  {/* Overlay on hover */}
  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-sm">
    <p className="font-semibold mb-1">
      HEX: {img.meta?.center_pixel?.hex ?? "—"}
    </p>
    <p className="mb-1">
      Spots: {img.meta?.counts?.blobs ?? (img.meta?.blobs?.length ?? "—")}
    </p>
    <p>
      Date:{" "}
      {img.meta?.date
        ? img.meta.date
        : img.createdAt
        ? new Date(img.createdAt).toLocaleDateString()
        : "—"}
    </p>
  </div>

  {/* Footer (still shows the ID below image) */}
  <div className="p-4">
    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
      {img.public_id}
    </h3>
  </div>
</article>

          </button>
        ))}
      </div>
    </div>
  );
}
