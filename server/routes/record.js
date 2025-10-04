import express from "express";
import { getDB } from "../db/connection.js";   // <-- named import
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/__whoami", (_req, res) => {
  res.json({ ok: true, from: "record router" });
});

router.get("/", async (_req, res) => {
  try {
    //const url = await Cloudinary.uploadimage("myimage");
    const docs = await getDB().collection("skinlumina").find({}).toArray();
    
    res.status(200).json(docs);
  } catch (err) {
    console.error("GET /record error:", err);
    res.status(500).send("Error fetching records");
  }
});

//new route to get the image everytime a user uploads..
//a route that gets all images and returns an array of urls back to frontend 

// --- DB health for the records collection ---
router.get("/__db", async (_req, res) => {
  try {
    const db = getDB();                       // ← this is what we’re testing
    const name = db.databaseName;
    const col = db.collection("records");

    // lightweight checks
    const count = await col.estimatedDocumentCount();
    const sample = await col.findOne({}, { projection: { _id: 1 }, sort: { _id: -1 } });

    res.status(200).json({
      ok: true,
      db: name,
      collection: "records",
      count,
      sampleId: sample?._id ?? null,
    });
  } catch (err) {
    console.error("DB health error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});




// safer id route name to avoid collisions
router.get("/by-id/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).send("Invalid id");
  try {
    const doc = await getDB().collection("records").findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).send("Not found");
    res.json(doc);
  } catch (err) {
    console.error("GET /record/by-id error:", err);
    res.status(500).send("Error fetching record");
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await getDB().collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
