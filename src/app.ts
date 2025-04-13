import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import morgan from "morgan";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// Routes
app.use("/api/v1", router);

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

export default app;
