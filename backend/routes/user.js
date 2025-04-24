const express = require('express');
const { handleUserSignup, handleUserLogin } = require('../controllers/user'); // double-check the path
const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);

module.exports = router;
