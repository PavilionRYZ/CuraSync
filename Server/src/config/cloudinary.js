const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Verify configuration on startup
if (!cloudinary.config().cloud_name) {
  console.warn("⚠️ WARNING: Cloudinary is not configured!");
  console.warn("Please check your environment variables:");
  console.warn("- CLOUDINARY_CLOUD_NAME");
  console.warn("- CLOUDINARY_API_KEY");
  console.warn("- CLOUDINARY_API_SECRET");
}

// ✅ Configure storage for doctor profile images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "curasync/doctors",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `doctor_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 11)}`,
      resource_type: "auto",
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" },
        { quality: "auto:good" },
      ],
    };
  },
});

// ✅ Multer configuration with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];

    if (!file) {
      return cb(new Error("No file provided"), false);
    }

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Only JPEG, PNG, and WebP are allowed. Received: ${file.mimetype}`
        ),
        false
      );
    }
  },
});

module.exports = { cloudinary, upload };
