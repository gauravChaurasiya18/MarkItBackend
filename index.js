
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import articleRoutes from "./routes/articles.js";

// Load environment variables
dotenv.config();

// Validate env variables
if (!process.env.DB_CONNECTION_STRING) {
  console.error("Missing DB_CONNECTION_STRING in .env");
  process.exit(1);
}

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // or 'http://localhost:5173' if you're using Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);

// Error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");

  // Start server only after successful DB connection
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err.message);
});
