const multer = require('multer');

// Set up storage engine
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename:  (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};
// Initialize multer with storage engine and file filter
const upload = multer({storage,fileFilter});

module.exports = { upload };