const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadImage.controller');
const {
  uploadSingleImageUtil,
  uploadMultipleImagesUtil,
} = require('../utils/multer');

router.post(
  '/single',
  uploadSingleImageUtil,
  uploadController.uploadSingleImage
);

router.post(
  '/multiple',
  uploadMultipleImagesUtil,
  uploadController.uploadMultipleImages
);

module.exports = router;
