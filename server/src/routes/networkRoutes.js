const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

router.get('/', networkController.getFullNetwork);

module.exports = router;
