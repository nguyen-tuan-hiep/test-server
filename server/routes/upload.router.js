const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const upload = require("../utils/multer");

router.post(
	"/single",
	upload.single("image"),
	uploadController.uploadSingleImage
);

router.post(
	"/multiple",
	upload.array("image", uploadController.maxNumFiles),
	uploadController.uploadMultipleImages
);

module.exports = router;
