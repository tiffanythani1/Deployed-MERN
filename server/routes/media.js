import express from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { getDB } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // no temp files


// POST /media/upload   (expects field name: "file" and optional text field "meta")
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    //delete if the world crashes
    
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // 1) Upload buffer -> Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "skinlumina/pi", resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    // 2) Parse analysis meta sent by your Python script
    let meta = null;
    if (req.body && typeof req.body.meta === "string" && req.body.meta.length) {
      try {
        meta = JSON.parse(req.body.meta);
      } catch {
        // Bad JSON? keep meta=null (or return 400 if you prefer)
        meta = null;
      }
    }

    const variant = req.body.variant || null;

    // 3) Build Mongo doc
    const doc = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      format: uploaded.format,
      meta,                 // ⬅️ your center hex, timings, regions, etc.
      variant,
      createdAt: new Date(),
    };

    // 4) Insert and return the inserted _id
    const db = getDB();
    const result = await db.collection("images").insertOne(doc);

    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: e.message });
  }
});

// GET /media/images  (for your gallery)
router.get("/images", async (_req, res) => {
  const imgs = await getDB()
    .collection("images")
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  res.json(imgs);
});

// GET /media/images/:id  (single doc, includes meta)
/*router.get("/images/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: "invalid_id" });

  const doc = await getDB().collection("images").findOne({ _id: new ObjectId(id) });
  if (!doc) return res.status(404).json({ error: "not_found" });
  res.json(doc);
});*/

// GET /media/images/:id  (single doc, includes meta)
router.get("/images/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "invalid_id" });
  }

  try {
    const doc = await getDB().collection("images").findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return res.status(404).json({ error: "not_found" });
    }

    // Explicitly include fields you care about (meta included)
    res.json({
      _id: doc._id,
      public_id: doc.public_id,
      url: doc.url,
      width: doc.width,
      height: doc.height,
      bytes: doc.bytes,
      format: doc.format,
      variant: doc.variant || null, 
      createdAt: doc.createdAt,
      
      meta: doc.meta || {}, // ✅ ensures blob info is always returned
    });
  } catch (err) {
    console.error("GET /media/images/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE /media?public_id=skinlumina/pi/...
router.delete("/", async (req, res) => {
  const public_id = req.query.public_id;
  if (!public_id) return res.status(400).json({ ok: false, error: "public_id is required" });

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
      invalidate: true,
    });

    const mongoRes = await getDB().collection("images").deleteOne({ public_id });

    res.json({
      ok: true,
      cloudinary: result,
      mongo_deleted: mongoRes.deletedCount,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
