const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: './images',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

//initializing multer
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/; //check extension names

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb({
      message: 'You can Only Upload Images!!',
    });
  }
};

const uploadSingleImageUtil = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle error thrown by multer when number of images > 1
      if (
        err instanceof multer.MulterError &&
        err.code === 'LIMIT_UNEXPECTED_FILE'
      ) {
        res.status(400).json({
          message: 'Too many files uploaded. Maximum allowed is 1.',
        });
      } else {
        res
          .status(400)
          .header('Content-Type', 'application/json')
          .send(JSON.stringify(err));
      }
    } else {
      next(); // No errors, proceed to route handler
    }
  });
};

const uploadMultipleImagesUtil = (req, res, next) => {
  // console.log(process.env.MAX_IMAGE_UPLOAD);
  upload.array('image', +process.env.MAX_IMAGE_UPLOAD)(req, res, (err) => {
    if (err) {
      // Handle error thrown by multer when number of images > 5
      if (
        err instanceof multer.MulterError &&
        err.code === 'LIMIT_UNEXPECTED_FILE'
      ) {
        res.status(400).json({
          message: 'Too many files uploaded. Maximum allowed is 5.',
        });
      } else {
        res
          .status(400)
          .header('Content-Type', 'application/json')
          .send(JSON.stringify(err));
      }
    } else {
      next(); // No errors, proceed to route handler
    }
  });
};

module.exports = {
  uploadSingleImageUtil,
  uploadMultipleImagesUtil,
};
