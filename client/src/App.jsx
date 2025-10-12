import { useEffect, useState } from "react";
import Upload from "./components/Upload.jsx";


export default function App() {
  const [images, setImages] = useState([]);

  // Load gallery on mount
  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/media/images")
      .then((r) => r.json())
      .then(setImages)
      .catch(console.error);
  }, []);

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
            <article
              key={img._id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg outline outline-black/5 transition hover:shadow-xl dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
            >
              <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700">
                <img
                  src={img.url}
                  alt={img.public_id}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {img.public_id}
                </h3>
              </div>
            </article>
          ))}
        </section>

        {/* Upload Button */}
        <div className="mt-10 flex justify-center">
          <Upload onUploaded={(doc) => setImages((prev) => [doc, ...prev])} />
        </div>
      </main>
    </div>
  );
}
