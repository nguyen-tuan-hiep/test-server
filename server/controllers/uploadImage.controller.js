const multer = require('multer');
const path = require('path');

const maxNumFiles = 5;
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
  limits: { fileSize: +process.env.MAX_FILE_SIZE },
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
    cb('Error: You can Only Upload Images!!');
  }
};

function uploadSingleImage(req, res) {
  console.log(req.file);
  if (!req.file || !Object.keys(req.file).length) {
    return res.status(400).send({ message: 'No files were uploaded' });
  }
  if (req.file) {
    res.json({ message: 'Single file uploaded successfully' });
  } else {
    res.status(400).send('Please upload a valid image');
    // res.json({ message: "Please upload a valid image" });
  }
}

function uploadMultipleImages(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  if (Object.keys(req.files).length <= 5) {
    res.json({ message: 'Multiple files uploaded successfully' });
  } else {
    res.json({ message: 'Please upload a valid images' });
  }
}

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  upload,
  maxNumFiles,
};
