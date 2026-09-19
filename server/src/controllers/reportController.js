const dataStore = require('../services/dataStoreService');

async function generateReport(req, res, next) {
  try {
    const { report_type, date_range, wallet_address, risk_level, format = 'json' } = req.body;

    let title = 'Bitcoin Traffic Intelligence Report';
    let records = [];

    if (report_type === 'Transaction Analysis Report') {
      title = 'Transaction Traffic & Anomaly Analysis Report';
      records = dataStore.transactions.filter(t => !risk_level || t.risk_level === risk_level);
    } else if (report_type === 'Wallet Analysis Report') {
      title = 'Wallet Risk & Counterparty Intelligence Report';
      records = dataStore.wallets.filter(w => !risk_level || w.risk_level === risk_level);
    } else if (report_type === 'Suspicious Activity Report') {
      title = 'Suspicious Activity & Pattern Detection Report (SAR)';
      records = dataStore.alerts;
    } else {
      title = 'Comprehensive Blockchain Intelligence Report';
      records = dataStore.transactions.slice(0, 50);
    }

    const reportData = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      title,
      report_type: report_type || 'General Analysis Report',
      generated_at: new Date().toISOString(),
      generated_by: req.user ? req.user.name : 'Analyst',
      filter_criteria: { date_range, wallet_address, risk_level },
      total_records: records.length,
      records: records.slice(0, 100)
    };

    return res.json({
      success: true,
      report: reportData
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateReport
};
