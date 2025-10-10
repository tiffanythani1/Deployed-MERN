import express from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { getDB } from "../db/connection.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // no temp files

// POST /media/upload   (expects field name: "file")
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // stream buffer -> Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "skinlumina/pi", resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    // save a lightweight record to Mongo
    const doc = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      format: uploaded.format,
      createdAt: new Date(),
    };
    await getDB().collection("images").insertOne(doc);

    res.status(201).json(doc);
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: e.message });
  }
});

// GET /media/images  (for your gallery)
router.get("/images", async (_req, res) => {
  const imgs = await getDB().collection("images")
    .find({}).sort({ createdAt: -1 }).limit(60).toArray();
  res.json(imgs);
});

export default router;
