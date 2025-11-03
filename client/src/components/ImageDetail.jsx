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

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-16">
      <Link className="text-indigo-600 underline" to="/">← Back to gallery</Link>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow">
          <img src={doc.url} alt={doc.public_id} className="w-full object-contain" />
          <div className="p-4 text-sm text-slate-600 dark:text-slate-300">
            <div>Public ID: <span className="font-mono">{doc.public_id}</span></div>
            <div>Uploaded: {uploadedAt}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow p-5">
          <h2 className="text-xl font-semibold mb-3">Image Info</h2>
          <div className="space-y-2">
            <div><span className="text-slate-500">Center Hex:</span> <span className="font-mono">{centerHex}</span></div>
            <div><span className="text-slate-500">Resolution:</span> {resW} × {resH}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
