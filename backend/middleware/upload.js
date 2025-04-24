const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "property_images", // optional folder name
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
