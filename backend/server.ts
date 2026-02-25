import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { analyzeRouter } from "./routes/analyze";
import { ApiError } from "./types";

const app = express();

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:8080";
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 15000);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || FRONTEND_ORIGIN)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Global process-level safety
process.on("unhandledRejection", (reason) => {
  console.error("[process] Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[process] Uncaught exception:", err);
});

// Security headers
app.use(helmet());

// Basic request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

// JSON parsing
app.use(express.json({ limit: "1mb" }));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Per-response timeout guard
app.use((req, res, next) => {
  res.setTimeout(REQUEST_TIMEOUT_MS, () => {
    console.warn(`Request timed out: ${req.method} ${req.originalUrl}`);
    if (!res.headersSent) {
      res.status(503).json({
        error: {
          message: "Request timed out",
          code: "REQUEST_TIMEOUT",
        },
      });
    }
  });
  next();
});

// Routes
app.use("/api/analyze", analyzeRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Not Found",
      code: "NOT_FOUND",
      path: req.originalUrl,
    },
  });
});

// Centralized error handler
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return;
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code ?? "API_ERROR",
      },
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};

app.use(errorHandler);

const server = http.createServer(app);

server.setTimeout(REQUEST_TIMEOUT_MS + 5000);

server.listen(PORT, () => {
  console.log(`AquaVigil backend listening on port ${PORT}`);
});

