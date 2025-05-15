const express = require('express');
const router = express.Router();
const {DataAnalytics, UserManagement,GetAllUsers, GetUserProperties,GetUserActivity} = require('../controllers/admin');
const { get } = require('mongoose');

router.get('/analytics', DataAnalytics);
router.get('/users',UserManagement);
router.get('/allUsers', GetAllUsers)
router.get('/properties',GetUserProperties)
router.get('/activitylog',GetUserActivity);
router.get('/me', (req, res) => {
    return res.json({ message: "Success", user: req.user });
});
  

module.exports = router;