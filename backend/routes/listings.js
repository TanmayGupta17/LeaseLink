const express = require("express");
const router = express.Router();
const { CreateProperty, GetAllProperties, GetPropertyById, GetUserProperties } = require("../controllers/listings");
const upload = require("../middleware/upload");

router.post("/create", upload.array("images", 5), CreateProperty);
router.get("/allproperty", GetAllProperties);
router.get("/userproperties", GetUserProperties); // Assuming you want to get properties by user ID
router.get("/:id", GetPropertyById); // Assuming you want to get a property by ID

module.exports = router;