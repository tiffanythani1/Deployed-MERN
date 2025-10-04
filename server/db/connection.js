// server/db/connection.js
import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

/** Connect once, then reuse the DB handle */
export async function initDB(dbName = "records") {
  const uri = process.env.ATLAS_URI;
  if (!uri) throw new Error("ATLAS_URI is missing from .env");
  console.log("🔌 initDB: connecting to Mongo…");

  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });

  await client.connect();
  await client.db("admin").command({ ping: 1 });
  db = client.db(dbName);
  console.log(`✅ Mongo connected. Using DB: ${db.databaseName}`);
}

/** Get the connected DB; throws if initDB() wasn’t called */
export function getDB() {
  if (!db) throw new Error("DB not initialized. Call initDB() first.");
  return db;
}
