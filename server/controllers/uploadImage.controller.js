import dotenv from 'dotenv';

dotenv.config();

function uploadSingleImage(req, res) {
  if (!req.file || !Object.keys(req.file).length) {
    return res.status(400).send({ message: 'No files were uploaded' });
  }
  return res.json({ message: 'Single file uploaded successfully' });
}

function uploadMultipleImages(req, res) {
  if (!req.files || !Object.keys(req.files).length) {
    return res.status(400).send({ message: 'No files were uploaded' });
  }
  return res.json({ message: 'Uploaded successfully' });
}

export default {
  uploadSingleImage,
  uploadMultipleImages,
};
