import { useEffect, useState } from "react";
import Upload from "./components/Upload.jsx";
import Navbar from "./components/Navbar.jsx";
import PatientRow from "./components/PatientRow.jsx";
import ZoomPanImage from "./components/ZoomPanImage.jsx";
import Analytics from "./components/Analytics.jsx";


export default function App() {
  const [images, setImages] = useState([]);
  const [tab, setTab] = useState("patients"); // "patients" | "analytics"

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
      <Navbar /> 

    <div className="flex gap-4 mt-24">
  <button
    onClick={() => setTab("patients")}
    className={`px-4 py-2 rounded-xl shadow ${
      tab === "patients"
        ? "bg-[#00274D] text-white"
        : "bg-white text-[#00274D]"
    }`}
  >
    Patients
  </button>

  <button
    onClick={() => setTab("analytics")}
    className={`px-4 py-2 rounded-xl shadow ${
      tab === "analytics"
        ? "bg-[#00274D] text-white"
        : "bg-white text-[#00274D]"
    }`}
  >
    Analytics
  </button>
</div>



      {/* Header */}


      <header className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#00274D]">
          SkinLumina <span className="font-light">Patient Portal</span>
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Multispectral dermatology imaging, simplified.
        </p>
      </header>


     {/* Gallery */}
{tab === "patients" && (
  <main className="w-full max-w-6xl mx-auto px-6 pb-16">

    
<div className="space-y-8">
  {images
    .filter(img => img.variant !== "plot")
    .reduce((rows, _, i) => {
      if (i % 6 === 0) rows.push(images.slice(i, i + 6));
      return rows;
    }, [])
    .map((rowImgs, idx) => (
      <PatientRow
        key={idx}
        images={rowImgs}
        onSelect={(id) => setSelectedId(id)}
      />
    ))}
</div>


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
)}


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
  const meta = doc?.meta || {};
  const blobs = Array.isArray(meta.blobs) ? meta.blobs : [];
  const blobCount = meta.counts?.blobs ?? blobs.length ?? 0;
  const totalMs = typeof meta.timing_ms === "number" ? meta.timing_ms.toFixed(1) : "—";

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
            {/* Image side */}
           {/* Image side (zoom + pan enabled) */}
<div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
  <ZoomPanImage src={doc.url} alt={doc.public_id} />
  <div className="p-3 text-sm text-slate-600 dark:text-slate-300">
    <div>
      Public ID: <span className="font-mono">{doc.public_id}</span>
    </div>
    <div>
      Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "—"}
    </div>
  </div>
</div>


            {/* Metadata + blob table */}
            <div className="p-1">
              <InfoRow label="Center Hex" value={meta.center_pixel?.hex ?? "—"} mono />
              <InfoRow
                label="Resolution"
                value={`${meta.image?.width ?? doc.width ?? "—"} × ${
                  meta.image?.height ?? doc.height ?? "—"
                }`}
              />
              <InfoRow label="Anomalies" value={blobCount} />
              <InfoRow label="Processing Time (ms)" value={totalMs} />

              {blobs.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-slate-900 dark:text-slate-100">
                    Detected Anomalies
                  </h3>
                  <div className="max-h-48 overflow-auto rounded border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/70">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium">ID</th>
                          <th className="text-left px-3 py-2 font-medium">Location (x, y)</th>
                          <th className="text-left px-3 py-2 font-medium">Diameter (µm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blobs.map((b, i) => (
                          <tr
                            key={b.blob_id ?? i}
                            className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-900/70"
                          >
                            <td className="px-3 py-1 font-mono">{b.blob_id ?? i + 1}</td>
                            <td className="px-3 py-1 font-mono">
                              ({b.center_x ?? "—"}, {b.center_y ?? "—"})
                            </td>
                            <td className="px-3 py-1 font-mono">
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
              {/* Analytics Module */}
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