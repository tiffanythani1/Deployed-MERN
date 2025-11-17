import { useEffect, useState } from "react";

export default function Analytics() {
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/media/images")
      .then((r) => r.json())
      .then((items) => {
        const filtered = items.filter(
          (img) => img?.variant === "plot"
        );
        setPlots(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="w-full max-w-5xl mx-auto px-6 pt-10 pb-20">
      <h2 className="text-3xl font-semibold mb-8 text-[#00274D] text-center">
        Analytics Dashboard
      </h2>

      {plots.length === 0 ? (
        <p className="text-center text-gray-600">
          No analysis plots uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plots.map((plot) => (
            <div
              key={plot._id}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow"
            >
              <img
                src={plot.url}
                alt={plot.public_id}
                className="rounded-xl mb-3"
              />

              <div className="text-sm text-slate-600 dark:text-slate-300">
                Date:{" "}
                {plot.createdAt
                  ? new Date(plot.createdAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

