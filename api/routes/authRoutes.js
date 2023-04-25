const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const path = require('path');
const multer = require('multer');
const upload = multer();

router.post('/', upload.none(), authController.loginAuthentication);

module.exports = router;
