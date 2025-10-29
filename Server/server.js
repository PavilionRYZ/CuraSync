const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/database");
const errorHandler = require("./src/middlewares/errorHandler");
const dotenv = require("dotenv");
// Import routes
const authRoutes = require("./src/routes/authRoutes");
const clinicRoutes = require("./src/routes/clinicRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const availabilityRoutes = require("./src/routes/availabilityRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

const app = express();
dotenv.config();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    cookie: {
      secure: process.env.NODE_ENV === "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    },
  })
);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});
