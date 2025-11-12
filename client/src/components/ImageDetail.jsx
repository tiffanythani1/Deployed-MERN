import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ImageDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/media/images/" + id)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Not found"))))
      .then(setDoc)
      .catch((e) => setErr(e.message));
  }, [id]);

  if (err) {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 pb-16">
        <p className="text-red-600">Error: {err}</p>
        <Link className="text-indigo-600 underline" to="/">← Back</Link>
      </div>
    );
  }
  if (!doc) {
    return <div className="w-full max-w-5xl mx-auto px-6 pb-16">Loading…</div>;
  }

  const meta = doc.meta || {};
  const centerHex = meta.center_pixel?.hex ?? "—";
  const uploadedAt = doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "—";
  const resW = meta.image?.width ?? doc.width ?? "—";
  const resH = meta.image?.height ?? doc.height ?? "—";

  const blobs = Array.isArray(meta.blobs) ? meta.blobs : [];
  const blobCount = meta.counts?.blobs ?? blobs.length ?? 0;
  const totalMs =
    typeof meta.timing_ms === "number"
      ? meta.timing_ms.toFixed(1)
      : "—";

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-16">
      <Link className="text-indigo-600 underline" to="/">← Back to gallery</Link>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow">
          <img
            src={doc.url}
            alt={doc.public_id}
            className="w-full object-contain"
          />
          <div className="p-4 text-sm text-slate-600 dark:text-slate-300">
            <div>
              Public ID: <span className="font-mono">{doc.public_id}</span>
            </div>
            <div>Uploaded: {uploadedAt}</div>
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow p-5">
          <h2 className="text-xl font-semibold mb-3">Image Info</h2>
          <div className="space-y-2">
            <div>
              <span className="text-slate-500">Center Hex:</span>{" "}
              <span className="font-mono">{centerHex}</span>
            </div>
            <div>
              <span className="text-slate-500">Resolution:</span> {resW} × {resH}
            </div>
            <div>
              <span className="text-slate-500">Anomalies:</span> {blobCount}
            </div>
            <div>
              <span className="text-slate-500">Processing Time (ms):</span> {totalMs}
            </div>
          </div>

          {/* Only show table if blobs exist */}
          {blobs.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold mb-2">Detected Anomalies</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/40">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">ID</th>
                      <th className="px-3 py-2 text-left font-medium">Location (x, y)</th>
                      <th className="px-3 py-2 text-left font-medium">Diameter (µm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blobs.map((b, i) => (
                      <tr
                        key={b.blob_id ?? i}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <td className="px-3 py-2">{b.blob_id ?? i + 1}</td>
                        <td className="px-3 py-2">
                          ({b.center_x ?? "—"}, {b.center_y ?? "—"})
                        </td>
                        <td className="px-3 py-2">
                          {typeof b.diameter_um === "number"
                            ? b.diameter_um.toFixed(1)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
