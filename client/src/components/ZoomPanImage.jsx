import { useRef, useState, useEffect } from "react";

export default function ZoomPanImage({ src, alt }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const MIN = 1;
  const MAX = 6;
  const STEP = 1.2; // zoom multiplier

  // keep image centered when resetting zoom
  useEffect(() => {
    if (!wrapperRef.current) return;
    const box = wrapperRef.current.getBoundingClientRect();
    setPos({ x: box.width * 0.5 * (1 - 1 / scale), y: box.height * 0.5 * (1 - 1 / scale) });
  }, [scale]);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const zoomAtPoint = (clientX, clientY, dir) => {
    const next = clamp(dir > 0 ? scale * STEP : scale / STEP, MIN, MAX);
    if (next === scale) return;

    // zoom toward cursor
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    const sx = cx / rect.width;
    const sy = cy / rect.height;

    // adjust position so the point under cursor stays under cursor
    const newX = pos.x + (sx * rect.width) * (1 - scale / next);
    const newY = pos.y + (sy * rect.height) * (1 - scale / next);

    setPos({ x: newX, y: newY });
    setScale(next);
  };

  const onWheel = (e) => {
    e.preventDefault();
    zoomAtPoint(e.clientX, e.clientY, e.deltaY < 0 ? 1 : -1);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = pos;
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPos({ x: posStart.current.x + dx, y: posStart.current.y + dy });
  };

  const onMouseUp = () => setDragging(false);

const zoomIn = () => {
  const rect = wrapperRef.current.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  zoomAtPoint(cx, cy, 1);
};

const zoomOut = () => {
  const rect = wrapperRef.current.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  zoomAtPoint(cx, cy, -1);
};


  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  // returns the client-rect of the image pixels inside the wrapper (not the wrapper itself)
const getDisplayedImageRect = () => {
  const wrap = wrapperRef.current;
  if (!wrap) return null;

  const rect = wrap.getBoundingClientRect();
  const img = wrap.querySelector("img");
  if (!img) return rect;

  const naturalW = img.naturalWidth || rect.width;
  const naturalH = img.naturalHeight || rect.height;

  // size that fits (object-contain)
  const scaleFit = Math.min(rect.width / naturalW, rect.height / naturalH);
  const dispW = naturalW * scaleFit;
  const dispH = naturalH * scaleFit;

  const left = rect.left + (rect.width - dispW) / 2;
  const top  = rect.top  + (rect.height - dispH) / 2;

  return { left, top, width: dispW, height: dispH };
};

  return (
  <div
    ref={wrapperRef}
    className="relative h-96 md:h-[420px] bg-black/80 rounded-xl overflow-hidden select-none"
    onWheel={onWheel}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseUp}
    onMouseUp={onMouseUp}
    onDoubleClick={(e) => zoomAtPoint(e.clientX, e.clientY, 1)} // 👈 double-click zoom at cursor
    style={{ cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default" }}
  >

      {/* image */}
      <img
        src={src}
        alt={alt}
        className="absolute top-0 left-0 w-full h-full object-contain"
        style={{
          transformOrigin: "top left",
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
        }}
      />

      {/* controls */}
      <div className="absolute right-3 top-3 flex gap-2">
        <button onClick={zoomOut} className="px-2 py-1 rounded bg-white/90 text-black text-sm shadow">−</button>
        <button onClick={zoomIn} className="px-2 py-1 rounded bg-white/90 text-black text-sm shadow">+</button>
        <button onClick={reset} className="px-2 py-1 rounded bg-white/90 text-black text-sm shadow">Reset</button>
      </div>
    </div>
  );
}
