import { useRef, useState } from "react";

export default function Upload({ onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const chooseFile = () => inputRef.current?.click();

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file); // <-- must be "file" to match upload.single("file")

      const r = await fetch(import.meta.env.VITE_API_BASE + "/media/upload", {
        method: "POST",
        body: form,
      });
      if (!r.ok) throw new Error("Upload failed");
      const doc = await r.json();

      onUploaded?.(doc); // let parent update the gallery immediately
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
      e.target.value = ""; // reset input
    }
  };

  return (
    <div>
      <button
        className="rounded-2xl bg-indigo-600 px-5 py-3 text-white shadow-md hover:bg-indigo-700 disabled:opacity-60"
        onClick={chooseFile}
        disabled={busy}
      >
        {busy ? "Uploading..." : "Upload Image"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
