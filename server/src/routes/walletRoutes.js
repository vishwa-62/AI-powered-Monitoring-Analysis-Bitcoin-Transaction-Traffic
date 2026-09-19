const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/', walletController.getWallets);
router.get('/:address', walletController.getWalletByAddress);
router.get('/:address/transactions', walletController.getWalletTransactions);
router.get('/:address/network', walletController.getWalletNetwork);

module.exports = router;
