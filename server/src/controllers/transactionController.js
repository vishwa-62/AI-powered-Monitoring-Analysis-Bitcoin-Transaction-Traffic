const dataStore = require('../services/dataStoreService');

async function getTransactions(req, res, next) {
  try {
    let { page = 1, limit = 20, search = '', risk_level = '', status = '', min_amount = '', max_amount = '', sort = 'timestamp', order = 'desc' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filtered = [...dataStore.transactions];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.tx_hash.toLowerCase().includes(q) ||
        (tx.sender && tx.sender.toLowerCase().includes(q)) ||
        (tx.receiver && tx.receiver.toLowerCase().includes(q)) ||
        tx.block_height.toString().includes(q)
      );
    }

    if (risk_level) {
      filtered = filtered.filter(tx => tx.risk_level.toUpperCase() === risk_level.toUpperCase());
    }

    if (status) {
      filtered = filtered.filter(tx => tx.status.toUpperCase() === status.toUpperCase());
    }

    if (min_amount) {
      filtered = filtered.filter(tx => tx.amount >= parseFloat(min_amount));
    }

    if (max_amount) {
      filtered = filtered.filter(tx => tx.amount <= parseFloat(max_amount));
    }

    // Sort
    filtered.sort((a, b) => {
      let valA = a[sort] || a.timestamp;
      let valB = b[sort] || b.timestamp;

      if (sort === 'timestamp') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getTransactionByHash(req, res, next) {
  try {
    const { hash } = req.params;
    const tx = dataStore.transactions.find(t => t.tx_hash.toLowerCase() === hash.toLowerCase());

    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Generate detail structure with inputs, outputs, network connections, and AI metadata
    const inputs = [
      { address: tx.sender, amount: tx.total_input, output_index: 0, previous_tx_hash: '00000000' + tx.tx_hash.substring(8, 30) }
    ];

    const outputs = [
      { address: tx.receiver, amount: tx.total_output }
    ];

    if (tx.output_count > 1) {
      for (let i = 1; i < tx.output_count; i++) {
        const dummyAddress = 'bc1q' + tx.tx_hash.substring(i * 2, i * 2 + 30);
        outputs.push({ address: dummyAddress, amount: parseFloat((tx.total_output * 0.1).toFixed(8)) });
      }
    }

    return res.json({
      success: true,
      transaction: {
        ...tx,
        confirmations: 14 + Math.floor(Math.random() * 50),
        inputs,
        outputs,
        related_wallets: [tx.sender, tx.receiver],
        network_connections: {
          nodes: [
            { id: tx.sender, label: 'Sender', risk_level: tx.risk_level },
            { id: tx.receiver, label: 'Receiver', risk_level: tx.risk_level }
          ],
          edges: [
            { source: tx.sender, target: tx.receiver, amount: tx.amount }
          ]
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const totalTxs = dataStore.transactions.length;
    const suspiciousTxs = dataStore.transactions.filter(t => t.risk_level === 'HIGH' || t.risk_level === 'CRITICAL').length;
    const totalVolume = dataStore.transactions.reduce((acc, t) => acc + t.amount, 0);
    const activeWallets = dataStore.wallets.length;
    const highRiskWallets = dataStore.wallets.filter(w => w.risk_level === 'HIGH' || w.risk_level === 'CRITICAL').length;
    const activeAlerts = dataStore.alerts.filter(a => a.status !== 'RESOLVED').length;
    const avgRiskScore = Math.round(dataStore.transactions.reduce((acc, t) => acc + t.risk_score, 0) / (totalTxs || 1));

    return res.json({
      success: true,
      stats: {
        total_transactions: totalTxs,
        transactions_today: Math.floor(totalTxs * 0.18),
        transaction_volume: parseFloat(totalVolume.toFixed(2)),
        active_wallets: activeWallets,
        suspicious_transactions: suspiciousTxs,
        high_risk_wallets: highRiskWallets,
        active_alerts: activeAlerts,
        avg_risk_score: avgRiskScore
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTransactions,
  getTransactionByHash,
  getStats
};
