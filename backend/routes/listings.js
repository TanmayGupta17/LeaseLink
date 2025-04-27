const express = require("express");
const router = express.Router();
const { CreateProperty, GetAllProperties, GetPropertyById } = require("../controllers/listings");
const upload = require("../middleware/upload");

router.post("/create", upload.array("images", 5), CreateProperty);
router.get("/allproperty", GetAllProperties);
router.get("/:id", GetPropertyById); // Assuming you want to get a property by ID

module.exports = router;