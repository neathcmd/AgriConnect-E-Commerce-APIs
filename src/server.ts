import express from "express";
import connectDB from "@/config/db";
import Router from "@/routes/index";
import { errorHandler } from "@/middleware/errorHandler";
import { setupSwagger } from "@/config/swagger";

const app = express();

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Doc
setupSwagger(app);

// === Routes ===
app.use("/api", Router);

// === 404 handler for unknown routes ===
app.use((req, res, next) => {
  const error = new Error("Route not found");
  (error as any).statusCode = 404;
  next(error); // forward to error middleware
});

// === Error-handling middleware (must be LAST) ===
app.use(errorHandler);

// === Connect to DB and start server ===
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
