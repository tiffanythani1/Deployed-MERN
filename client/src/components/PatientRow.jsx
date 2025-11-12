// client/src/components/PatientRow.jsx

export default function PatientRow({ images }) {
  if (!images || images.length === 0) return null;

  // Use the first image's meta as a representative summary for this "client"
  const first = images[0];
  const baseMeta = first.meta || first;

  // Sum blobs across this row's images (total detected spots for this client)
  const totalBlobs = images.reduce((sum, img) => {
    const m = img.meta || img;
    return sum + (m.blobs || 0);
  }, 0);

  return (
    <div className="flex items-start gap-6 my-8">
      {/* Left sidebar with client summary */}
      <div className="w-64 bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-3">
          {/* Placeholder label until you wire real patient IDs */}
          Medical Client
        </h2>

        <p className="text-sm text-gray-700">
          Number of Detected Spots:{" "}
          <span className="font-semibold text-sky-700">
            {totalBlobs}
          </span>
        </p>

        <p className="text-sm text-gray-700">
          Capture Date:{" "}
          <span className="font-mono">
            {baseMeta.date || "—"}
          </span>
        </p>

        <p className="text-sm text-gray-700">
          Center HEX (sample):{" "}
          <span className="font-mono">
            {baseMeta.center_hex || "—"}
          </span>
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Avg lesion diameter (µm):{" "}
          {baseMeta.avg_diam_um !== "" && baseMeta.avg_diam_um != null
            ? baseMeta.avg_diam_um
            : "—"}
        </p>

        <p className="text-xs text-gray-500">
          Processing time (ms):{" "}
          {baseMeta.total_ms != null ? baseMeta.total_ms : "—"}
        </p>
      </div>

      {/* Right side: 5-wide grid of this client's images */}
      <div className="grid grid-cols-5 gap-4 flex-1">
        {images.map((img) => {
          const m = img.meta || img;

          return (
            <div
              key={img._id || m.file}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={img.url}
                alt={m.file}
                className="w-full h-40 object-cover"
              />
              <div className="px-2 py-1">
                <p className="text-[10px] text-gray-600 truncate">
                  {m.file}
                </p>
                <p className="text-[10px] text-gray-500">
                  Spots: {m.blobs ?? "—"} • HEX: {m.center_hex ?? "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
