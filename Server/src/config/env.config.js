const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Export configuration object
module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  slotDuration: parseInt(process.env.SLOT_DURATION_MINUTES) || 30,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
};
