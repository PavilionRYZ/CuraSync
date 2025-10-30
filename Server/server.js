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
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();
dotenv.config();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Body parser - ✅ INCREASED LIMIT for image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

// Health check - ✅ ENHANCED
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏥 CuraSync API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    database:
      require("mongoose").connection.readyState === 1
        ? "Connected"
        : "Disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
// app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                           
║  🏥  CuraSync API Server Running                          
║                                                           
║  📍 Port: ${PORT}                                         
║  🌍 Environment: ${process.env.NODE_ENV || "development"} 
║  🔗 URL: http://localhost:${PORT}                         
║  📅 Started: ${new Date().toLocaleTimeString()}           
║                                                           
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
