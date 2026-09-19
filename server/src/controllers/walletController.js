const dataStore = require('../services/dataStoreService');

async function getWallets(req, res, next) {
  try {
    let { page = 1, limit = 20, search = '', risk_level = '', status = '', sort = 'risk_score', order = 'desc' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filtered = [...dataStore.wallets];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(w => w.address.toLowerCase().includes(q));
    }

    if (risk_level) {
      filtered = filtered.filter(w => w.risk_level.toUpperCase() === risk_level.toUpperCase());
    }

    if (status) {
      filtered = filtered.filter(w => w.status.toUpperCase() === status.toUpperCase());
    }

    filtered.sort((a, b) => {
      let valA = a[sort] || a.risk_score;
      let valB = b[sort] || b.risk_score;

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

async function getWalletByAddress(req, res, next) {
  try {
    const { address } = req.params;
    const wallet = dataStore.wallets.find(w => w.address.toLowerCase() === address.toLowerCase());

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet address not found in monitoring index' });
    }

    const txs = dataStore.transactions.filter(t => 
      t.sender.toLowerCase() === address.toLowerCase() || 
      t.receiver.toLowerCase() === address.toLowerCase()
    );

    const incoming = txs.filter(t => t.receiver.toLowerCase() === address.toLowerCase());
    const outgoing = txs.filter(t => t.sender.toLowerCase() === address.toLowerCase());

    const incomingVolume = incoming.reduce((acc, t) => acc + t.amount, 0);
    const outgoingVolume = outgoing.reduce((acc, t) => acc + t.amount, 0);

    const behaviorAnalysis = {
      velocity_trend: wallet.risk_score > 60 ? 'HIGH_BURST' : 'STABLE',
      clustering_factor: wallet.unique_counterparties > 10 ? 'HUB_NODE' : 'STANDARD',
      anomaly_indicators: wallet.risk_score > 60 ? [
        'Frequent interactions with high-risk flagged wallets',
        'Abnormal volume dispersion across multiple outbound hops',
        'Rapid fund throughput within short block intervals'
      ] : [
        'Normal transaction patterns within historical baseline',
        'Balanced incoming and outgoing flow volume'
      ]
    };

    return res.json({
      success: true,
      wallet: {
        ...wallet,
        tx_history_count: txs.length,
        incoming_count: incoming.length,
        outgoing_count: outgoing.length,
        incoming_volume: parseFloat(incomingVolume.toFixed(8)),
        outgoing_volume: parseFloat(outgoingVolume.toFixed(8)),
        behavior_analysis: behaviorAnalysis
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getWalletTransactions(req, res, next) {
  try {
    const { address } = req.params;
    const txs = dataStore.transactions.filter(t => 
      t.sender.toLowerCase() === address.toLowerCase() || 
      t.receiver.toLowerCase() === address.toLowerCase()
    );

    return res.json({
      success: true,
      data: txs.slice(0, 50)
    });
  } catch (err) {
    next(err);
  }
}

async function getWalletNetwork(req, res, next) {
  try {
    const { address } = req.params;
    const txs = dataStore.transactions.filter(t => 
      t.sender.toLowerCase() === address.toLowerCase() || 
      t.receiver.toLowerCase() === address.toLowerCase()
    ).slice(0, 25);

    const nodesMap = new Map();
    const edges = [];

    // Center node
    const centerWallet = dataStore.wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    nodesMap.set(address, {
      id: address,
      address,
      risk_score: centerWallet ? centerWallet.risk_score : 50,
      risk_level: centerWallet ? centerWallet.risk_level : 'MEDIUM',
      is_center: true
    });

    txs.forEach(t => {
      if (!nodesMap.has(t.sender)) {
        const sW = dataStore.wallets.find(w => w.address === t.sender);
        nodesMap.set(t.sender, {
          id: t.sender,
          address: t.sender,
          risk_score: sW ? sW.risk_score : 20,
          risk_level: sW ? sW.risk_level : 'LOW'
        });
      }
      if (!nodesMap.has(t.receiver)) {
        const rW = dataStore.wallets.find(w => w.address === t.receiver);
        nodesMap.set(t.receiver, {
          id: t.receiver,
          address: t.receiver,
          risk_score: rW ? rW.risk_score : 20,
          risk_level: rW ? rW.risk_level : 'LOW'
        });
      }

      edges.push({
        id: `e-${t.tx_hash.substring(0, 10)}`,
        source: t.sender,
        target: t.receiver,
        amount: t.amount,
        tx_hash: t.tx_hash
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
  getWallets,
  getWalletByAddress,
  getWalletTransactions,
  getWalletNetwork
};
