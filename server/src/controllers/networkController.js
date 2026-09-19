const dataStore = require('../services/dataStoreService');

async function getFullNetwork(req, res, next) {
  try {
    let { limit = 60, min_amount = 0, risk_level = '' } = req.query;
    limit = parseInt(limit);

    let txs = [...dataStore.transactions];

    if (min_amount) {
      txs = txs.filter(t => t.amount >= parseFloat(min_amount));
    }

    if (risk_level) {
      txs = txs.filter(t => t.risk_level.toUpperCase() === risk_level.toUpperCase());
    }

    txs = txs.slice(0, limit);

    const nodesMap = new Map();
    const edges = [];

    txs.forEach((t, idx) => {
      if (!nodesMap.has(t.sender)) {
        const sW = dataStore.wallets.find(w => w.address === t.sender);
        nodesMap.set(t.sender, {
          id: t.sender,
          label: `${t.sender.substring(0, 6)}...${t.sender.substring(t.sender.length - 4)}`,
          address: t.sender,
          risk_score: sW ? sW.risk_score : t.risk_score,
          risk_level: sW ? sW.risk_level : t.risk_level,
          tx_count: sW ? sW.transaction_count : 1,
          balance: sW ? sW.balance : 5.0
        });
      }

      if (!nodesMap.has(t.receiver)) {
        const rW = dataStore.wallets.find(w => w.address === t.receiver);
        nodesMap.set(t.receiver, {
          id: t.receiver,
          label: `${t.receiver.substring(0, 6)}...${t.receiver.substring(t.receiver.length - 4)}`,
          address: t.receiver,
          risk_score: rW ? rW.risk_score : 15,
          risk_level: rW ? rW.risk_level : 'LOW',
          tx_count: rW ? rW.transaction_count : 1,
          balance: rW ? rW.balance : 1.5
        });
      }

      edges.push({
        id: `e-${t.tx_hash.substring(0, 10)}-${idx}`,
        source: t.sender,
        target: t.receiver,
        amount: t.amount,
        tx_hash: t.tx_hash,
        risk_score: t.risk_score
      });
    });

    return res.json({
      success: true,
      nodes: Array.from(nodesMap.values()),
      edges
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFullNetwork
};
