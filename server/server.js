// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import records from "./routes/record.js";

dotenv.config(); // loads PORT from .env

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// simple router mounted at /record
app.use("/record", records);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


//we are importing express and cors to be used. 
// const port = process.env.PORT will access the port variable 
// from the config.env we’ll create next.