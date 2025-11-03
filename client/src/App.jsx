import { useEffect, useState } from "react";
import Upload from "./components/Upload.jsx";
import Navbar from "./components/Navbar.jsx";
export default function App() {
  const [images, setImages] = useState([]);

  // Modal state
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailErr, setDetailErr] = useState("");

  // Load gallery on mount (keep your exact fetch line)
  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/media/images")
      .then((r) => r.json())
      .then(setImages)
      .catch(console.error);
  }, []);

  // When a card is clicked, fetch details by _id
  useEffect(() => {
    if (!selectedId) return;
    setLoadingDetail(true);
    setDetailErr("");
    setDetail(null);

    fetch(import.meta.env.VITE_API_BASE + "/media/images/" + selectedId)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Not found"))))
      .then(setDetail)
      .catch((e) => setDetailErr(e.message))
      .finally(() => setLoadingDetail(false));
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center">

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          SkinLumina
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Multispectral dermatology imaging, simplified.
        </p>
      </header>

      {/* Gallery */}
      <main className="w-full max-w-5xl mx-auto px-6 pb-16">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <button
              key={img._id}
              onClick={() => setSelectedId(img._id)}
              className="text-left"
              title="View details"
            >
              <article className="overflow-hidden rounded-2xl bg-white shadow-lg outline outline-black/5 transition hover:shadow-xl dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700">
                  <img
                    src={img.url}
                    alt={img.public_id}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {img.public_id}
                  </h3>
                </div>
              </article>
            </button>
          ))}
        </section>

        {/* Upload Button */}
        <div className="mt-10 flex justify-center">
          <Upload
            onUploaded={(doc) => {
              // ensure the new doc shows up immediately
              setImages((prev) => [doc, ...prev]);
            }}
          />
        </div>
      </main>

      {/* Details Modal */}
      {selectedId && (
        <DetailsModal
          doc={detail}
          loading={loadingDetail}
          error={detailErr}
          onClose={() => {
            setSelectedId(null);
            setDetail(null);
            setDetailErr("");
          }}
        />
      )}
    </div>
  );
}

function DetailsModal({ doc, loading, error, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Image Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="p-6">Loading…</div>
        ) : error ? (
          <div className="p-6 text-red-600">Error: {error}</div>
        ) : doc ? (
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <img src={doc.url} alt={doc.public_id} className="w-full object-contain" />
              <div className="p-3 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  Public ID: <span className="font-mono">{doc.public_id}</span>
                </div>
                <div>
                  Uploaded:{" "}
                  {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            <div className="p-1">
              <InfoRow label="Center Hex" value={doc.meta?.center_pixel?.hex ?? "—"} mono />
              <InfoRow
                label="Resolution"
                value={`${doc.meta?.image?.width ?? doc.width ?? "—"} × ${
                  doc.meta?.image?.height ?? doc.height ?? "—"
                }`}
              />
              <InfoRow label="Anomalies" value={`${doc.meta?.counts?.anomalies ?? 0}`} />
              <InfoRow label="Total (ms)" value={`${doc.meta?.timing?.total_ms ?? "—"}`} />

              {Array.isArray(doc.meta?.regions) && doc.meta.regions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-slate-900 dark:text-slate-100">
                    Regions
                  </h3>
                  <div className="max-h-48 overflow-auto rounded border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/70">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium">X</th>
                          <th className="text-left px-3 py-2 font-medium">Y</th>
                          <th className="text-left px-3 py-2 font-medium">W</th>
                          <th className="text-left px-3 py-2 font-medium">H</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doc.meta.regions.map((r, i) => (
                          <tr
                            key={i}
                            className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-900/70"
                          >
                            <td className="px-3 py-1 font-mono">{r.x}</td>
                            <td className="px-3 py-1 font-mono">{r.y}</td>
                            <td className="px-3 py-1 font-mono">{r.w}</td>
                            <td className="px-3 py-1 font-mono">{r.h}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">No details.</div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="mt-2">
      <span className="text-slate-500">{label}:</span>{" "}
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}
