const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAlerts);
router.get('/:id', alertController.getAlertById);
router.put('/:id/status', alertController.updateAlertStatus);
router.put('/:id/assign', alertController.assignAlert);
router.post('/:id/notes', alertController.addAlertNote);

module.exports = router;
