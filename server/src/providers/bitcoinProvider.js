const axios = require('axios');
const crypto = require('crypto');

class BitcoinDataProvider {
  constructor(providerType = 'synthetic', apiUrl = '') {
    this.providerType = providerType;
    this.apiUrl = apiUrl;
  }

  generateTxHash() {
    return '00000000' + crypto.randomBytes(28).toString('hex');
  }

  generateWalletAddress() {
    const prefixes = ['1', '3', 'bc1q'];
    const pfx = prefixes[Math.floor(Math.random() * prefixes.length)];
    return pfx + crypto.randomBytes(16).toString('hex').substring(0, 30);
  }

  generateSyntheticTransaction(customSender = null, customReceiver = null) {
    const sender = customSender || this.generateWalletAddress();
    const receiver = customReceiver || this.generateWalletAddress();
    const isAnomaly = Math.random() < 0.15; // 15% high-risk transactions
    
    let amount = parseFloat((Math.random() * 2.5 + 0.05).toFixed(8));
    let fee = parseFloat((Math.random() * 0.0002 + 0.00005).toFixed(8));
    let inputCount = Math.floor(Math.random() * 3) + 1;
    let outputCount = Math.floor(Math.random() * 3) + 1;

    if (isAnomaly) {
      const anomalyType = Math.floor(Math.random() * 4);
      if (anomalyType === 0) {
        amount = parseFloat((Math.random() * 80 + 35).toFixed(8)); // High amount
      } else if (anomalyType === 1) {
        inputCount = Math.floor(Math.random() * 12) + 8; // Fan-in
      } else if (anomalyType === 2) {
        outputCount = Math.floor(Math.random() * 14) + 8; // Fan-out
      } else {
        fee = parseFloat((Math.random() * 0.05 + 0.01).toFixed(8)); // High fee
      }
    }

    const txHash = this.generateTxHash();
    const blockHeight = 860000 + Math.floor(Math.random() * 500);

    return {
      tx_hash: txHash,
      block_height: blockHeight,
      block_hash: '0000000000000000000' + crypto.randomBytes(22).toString('hex'),
      timestamp: new Date().toISOString(),
      sender,
      receiver,
      amount,
      usd_value: parseFloat((amount * 65000).toFixed(2)),
      fee,
      fee_usd: parseFloat((fee * 65000).toFixed(2)),
      size: Math.floor(Math.random() * 300) + 180,
      input_count: inputCount,
      output_count: outputCount,
      is_anomaly: isAnomaly
    };
  }

  async getLatestTransactions(limit = 20) {
    if (this.providerType === 'live' && this.apiUrl) {
      try {
        const response = await axios.get(`${this.apiUrl}/unconfirmed-transactions?format=json`);
        if (response.data && response.data.txs) {
          return response.data.txs.slice(0, limit).map(tx => ({
            tx_hash: tx.hash,
            block_height: 860420,
            timestamp: new Date(tx.time * 1000).toISOString(),
            amount: (tx.out.reduce((acc, o) => acc + o.value, 0) / 1e8),
            fee: (tx.fee / 1e8) || 0.0001,
            size: tx.size || 225,
            input_count: tx.inputs ? tx.inputs.length : 1,
            output_count: tx.out ? tx.out.length : 1
          }));
        }
      } catch (err) {
        console.warn('[BitcoinProvider] Live API fetch failed, falling back to synthetic provider:', err.message);
      }
    }

    // Default synthetic generator
    const txs = [];
    for (let i = 0; i < limit; i++) {
      txs.push(this.generateSyntheticTransaction());
    }
    return txs;
  }

  async getTransaction(hash) {
    return this.generateSyntheticTransaction();
  }

  async getBlock(height) {
    return {
      height,
      hash: '0000000000000000000' + crypto.randomBytes(22).toString('hex'),
      tx_count: Math.floor(Math.random() * 2000) + 1500,
      timestamp: new Date().toISOString()
    };
  }

  async getWalletTransactions(address) {
    const txs = [];
    for (let i = 0; i < 8; i++) {
      txs.push(this.generateSyntheticTransaction(address, null));
    }
    return txs;
  }
}

module.exports = new BitcoinDataProvider(
  process.env.BITCOIN_PROVIDER || 'synthetic',
  process.env.BITCOIN_API_URL || ''
);
