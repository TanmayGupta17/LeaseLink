const express = require("express");
const router = express.Router();
const {
  DataAnalytics,
  UserManagement,
  GetAllUsers,
  GetUserProperties,
  GetUserActivity,
  UpdateUser,
  DeleteUser,
  UpdateUserProperty,
  DeleteUserProperty,
  GetReportedProperties,
  VerifyProperty,
} = require("../controllers/admin");
const { get } = require("mongoose");

router.get("/analytics", DataAnalytics);
router.get("/users", UserManagement);
router.get("/allUsers", GetAllUsers);
router.get("/properties", GetUserProperties);
router.get("/activitylog", GetUserActivity);
router.get("/getReportedproperty", GetReportedProperties);

//dynamic routes for user management
router.put("/updateUser/:id", UpdateUser);
router.put("/verifyProperty/:id", VerifyProperty);
router.put("/UpdateUserProperty/:id", UpdateUserProperty);
router.delete("/deleteUserProperty/:id", DeleteUserProperty);
router.delete("/deleteUser/:id", DeleteUser);
router.get("/me", (req, res) => {
  return res.json({ message: "Success", user: req.user });
});

module.exports = router;
