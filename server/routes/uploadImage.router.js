import express from 'express';
import uploadController from '../controllers/uploadImage.controller.js';
import uploadImageUtil from '../utils/multer.js';

const router = express.Router();

router.post('/single', uploadImageUtil.uploadSingleImageUtil, uploadController.uploadSingleImage);

router.post(
  '/multiple',
  uploadImageUtil.uploadMultipleImagesUtil,
  uploadController.uploadMultipleImages,
);

export default router;
