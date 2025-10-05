export default function App() {
  const images = ["/samples/one.jpg", "/samples/two.jpg", "/samples/three.jpg"];

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
          {images.map((src, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-lg outline outline-black/5 transition hover:shadow-xl dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
            >
              <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700">
                <img
                  src={src}
                  alt={`SkinLumina demo ${i + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  SkinLumina demo {i + 1}
                </h3>
              </div>
            </article>
          ))}
        </section>

        {/* Upload Button */}
        <div className="mt-10 flex justify-center">
          <button
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-white shadow-md transition hover:bg-indigo-700"
            onClick={() => alert("Upload coming next!")}
          >
            Upload Image
          </button>
        </div>
      </main>
    </div>
  );
}
