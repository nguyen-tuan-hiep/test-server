import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Setting storage engine
const storageEngine = multer.diskStorage({
  destination: './images',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const checkFileType = (file, cb) => {
  // Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/; // check extension names

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  }
  return cb({
    message: 'You can only upload images!!',
  });
};

// initializing multer
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: +process.env.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const uploadSingleImageUtil = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        // Handle error thrown by multer when number of images > 1
        res.status(400).json({
          message: 'Too many files uploaded. Maximum allowed is 1.',
        });
      } else {
        // Handle other Multer errors
        res.status(400).json({
          message: `${err.message}`,
        });
      }
    } else if (err) {
      // Handle non-Multer errors
      res.status(400).json({
        message: err.message || 'Unknown error occurred',
      });
    } else {
      next(); // No errors, proceed to route handler
    }
  });
};

const uploadMultipleImagesUtil = (req, res, next) => {
  // console.log(process.env.MAX_IMAGE_UPLOAD);
  upload.array('image', +process.env.MAX_IMAGE_UPLOAD)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        // Handle error thrown by multer when number of images > 1
        res.status(400).json({
          message: 'Too many files uploaded. Maximum allowed is 5.',
        });
      } else {
        // handle other Multer errors
        res.status(400).json({
          message: `${err.message}`,
        });
      }
    } else if (err) {
      // Handle non-Multer errors
      res.status(400).json({
        message: err.message || 'Unknown error occurred',
      });
    } else {
      next(); // No errors, proceed to route handler
    }
  });
};

export default {
  uploadSingleImageUtil,
  uploadMultipleImagesUtil,
};
