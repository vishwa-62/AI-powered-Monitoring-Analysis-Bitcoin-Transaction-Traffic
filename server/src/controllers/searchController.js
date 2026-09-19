const dataStore = require('../services/dataStoreService');

async function searchGlobal(req, res, next) {
  try {
    const { q = '' } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, results: [] });
    }

    const queryStr = q.trim().toLowerCase();
    const results = [];

    // Search Transactions
    dataStore.transactions.forEach(t => {
      if (t.tx_hash.toLowerCase().includes(queryStr)) {
        results.push({
          type: 'TRANSACTION',
          title: `Transaction ${t.tx_hash.substring(0, 14)}...`,
          subtitle: `${t.amount} BTC • Block ${t.block_height}`,
          link: `/transactions/${t.tx_hash}`,
          risk_level: t.risk_level
        });
      }
    });

    // Search Wallets
    dataStore.wallets.forEach(w => {
      if (w.address.toLowerCase().includes(queryStr)) {
        results.push({
          type: 'WALLET',
          title: `Wallet ${w.address.substring(0, 14)}...`,
          subtitle: `Balance: ${w.balance} BTC • Risk Score: ${w.risk_score}`,
          link: `/wallets/${w.address}`,
          risk_level: w.risk_level
        });
      }
    });

    // Search Alerts
    dataStore.alerts.forEach(a => {
      if (a.id.toString() === queryStr || (a.tx_hash && a.tx_hash.toLowerCase().includes(queryStr)) || a.alert_type.toLowerCase().includes(queryStr)) {
        results.push({
          type: 'ALERT',
          title: `Alert #${a.id}: ${a.alert_type}`,
          subtitle: `Severity: ${a.severity} • Status: ${a.status}`,
          link: `/alerts`,
          risk_level: a.severity
        });
      }
    });

    // Search Blocks
    if (!isNaN(queryStr)) {
      results.push({
        type: 'BLOCK',
        title: `Block #${queryStr}`,
        subtitle: `Bitcoin Blockchain Block Height`,
        link: `/transactions?search=${queryStr}`,
        risk_level: 'LOW'
      });
    }

    return res.json({
      success: true,
      query: q,
      total: results.length,
      results: results.slice(0, 20)
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchGlobal
};
