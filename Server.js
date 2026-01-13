import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

import authRoutes from "./routes/auth.js";
import jobsRoutes from "./routes/jobs.js";
import appsRoutes from "./routes/applications.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", appsRoutes);

// DB connect
sequelize
  .sync()
  .then(() => {
    console.log("MySQL Connected & Tables Synced!");
  })
  .catch((err) => {
    console.log("DB Error", err);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
