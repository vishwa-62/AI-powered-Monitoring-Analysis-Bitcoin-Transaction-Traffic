const aiService = require('../services/aiService');
const dataStore = require('../services/dataStoreService');

async function analyzeTransaction(req, res, next) {
  try {
    const result = await aiService.analyzeTransaction(req.body);
    return res.json({ success: true, analysis: result });
  } catch (err) {
    next(err);
  }
}

async function analyzeWallet(req, res, next) {
  try {
    const result = await aiService.analyzeWallet(req.body);
    return res.json({ success: true, analysis: result });
  } catch (err) {
    next(err);
  }
}

async function getAnomalies(req, res, next) {
  try {
    const totalAnalyzed = dataStore.transactions.length;
    const anomalies = dataStore.transactions.filter(t => t.risk_score >= 50);
    const highRisk = dataStore.transactions.filter(t => t.risk_level === 'HIGH');
    const criticalRisk = dataStore.transactions.filter(t => t.risk_level === 'CRITICAL');
    const highRiskWallets = dataStore.wallets.filter(w => w.risk_level === 'HIGH' || w.risk_level === 'CRITICAL');

    return res.json({
      success: true,
      stats: {
        total_analyzed: totalAnalyzed,
        anomalies_detected: anomalies.length,
        high_risk_count: highRisk.length,
        critical_risk_count: criticalRisk.length,
        high_risk_wallets: highRiskWallets.length
      },
      feed: anomalies.slice(0, 15)
    });
  } catch (err) {
    next(err);
  }
}

async function getRiskDistribution(req, res, next) {
  try {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    dataStore.transactions.forEach(t => {
      if (counts[t.risk_level] !== undefined) counts[t.risk_level]++;
    });

    return res.json({ success: true, distribution: counts });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  analyzeTransaction,
  analyzeWallet,
  getAnomalies,
  getRiskDistribution
};
