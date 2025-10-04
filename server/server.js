import express from "express";
import cors from "cors";
import { initDB } from "./db/connection.js";

const app = express();

console.log("BOOT pid=%s cwd=%s", process.pid, process.cwd());

app.use((req, _res, next) => {           // <— logger
  console.log("HIT", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

// root + diag
app.get("/", (_req, res) => res.send("SkinLumina API running. Try /__whoami or /record"));
app.get("/__whoami", (_req, res) => res.json({ ok: true, from: "server.js", pid: process.pid }));

import records from "./routes/record.js";
app.use("/record", records);

const PORT = process.env.PORT || 5050;
(async () => {
  await initDB("skinlumina");
  app.listen(PORT, () => console.log("Listening on http://localhost:%s", PORT));
})();
