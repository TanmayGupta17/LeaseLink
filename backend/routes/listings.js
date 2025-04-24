const express = require("express");
const router = express.Router();
const { CreateProperty, GetAllProperties } = require("../controllers/listings");
const upload = require("../middleware/upload");

router.post("/create", upload.array("images", 5), CreateProperty);
router.get("/allproperty", GetAllProperties);

module.exports = router;