const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "images"));
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err);
      cb(null, buf.toString("hex") + path.extname(file.originalname).toLowerCase());
    });
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  
  // Verificar mimetype
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Solo se permiten imágenes (JPG, JPEG, PNG, WEBP, GIF)"), false);
  }
  
  // Verificar extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Extension de archivo no permitida. Solo JPG, JPEG, PNG, WEBP, GIF"), false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "La imagen excede el tamaño máximo de 2MB"
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = { upload, handleUpload };
