import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auth from "./Auth/routes/index.js";
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());


app.use(express.json());
app.use("/", auth);
app.use("/auth", auth);
// ✅ CORS setup for frontend
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
// ✅ Test API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Backend 👋hi " });
});


// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
