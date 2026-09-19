const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze/transaction', aiController.analyzeTransaction);
router.post('/analyze/wallet', aiController.analyzeWallet);
router.get('/anomalies', aiController.getAnomalies);
router.get('/risk-distribution', aiController.getRiskDistribution);

module.exports = router;
