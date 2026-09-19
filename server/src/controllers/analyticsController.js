const dataStore = require('../services/dataStoreService');

async function getAnalyticsOverview(req, res, next) {
  try {
    // 1. Transactions per hour (24 hours)
    const txsPerHour = Array.from({ length: 24 }, (_, i) => {
      const hourStr = `${String(i).padStart(2, '0')}:00`;
      return {
        hour: hourStr,
        transactions: Math.floor(Math.random() * 45) + 15,
        volume: parseFloat((Math.random() * 120 + 20).toFixed(2))
      };
    });

    // 2. Transactions per day (7 days)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const txsPerDay = days.map(day => ({
      day,
      transactions: Math.floor(Math.random() * 250) + 120,
      volume: parseFloat((Math.random() * 800 + 300).toFixed(2)),
      anomalies: Math.floor(Math.random() * 25) + 5
    }));

    // 3. Risk distribution
    const riskDistribution = [
      { name: 'LOW', value: dataStore.transactions.filter(t => t.risk_level === 'LOW').length, color: '#10B981' },
      { name: 'MEDIUM', value: dataStore.transactions.filter(t => t.risk_level === 'MEDIUM').length, color: '#F59E0B' },
      { name: 'HIGH', value: dataStore.transactions.filter(t => t.risk_level === 'HIGH').length, color: '#EF4444' },
      { name: 'CRITICAL', value: dataStore.transactions.filter(t => t.risk_level === 'CRITICAL').length, color: '#8B5CF6' }
    ];

    // 4. Top active wallets
    const topWallets = [...dataStore.wallets]
      .sort((a, b) => b.transaction_count - a.transaction_count)
      .slice(0, 10)
      .map(w => ({
        address: w.address,
        short_address: `${w.address.substring(0, 8)}...${w.address.substring(w.address.length - 6)}`,
        tx_count: w.transaction_count,
        balance: w.balance,
        risk_score: w.risk_score
      }));

    // 5. Fee analysis
    const feeDistribution = [
      { range: '<0.0001 BTC', count: 420 },
      { range: '0.0001 - 0.0005 BTC', count: 380 },
      { range: '0.0005 - 0.001 BTC', count: 180 },
      { range: '>0.001 BTC', count: 70 }
    ];

    // 6. Size distribution
    const sizeDistribution = [
      { size_range: '180-220 Bytes', count: 520 },
      { size_range: '221-300 Bytes', count: 350 },
      { size_range: '301-500 Bytes', count: 120 },
      { size_range: '>500 Bytes', count: 60 }
    ];

    return res.json({
      success: true,
      analytics: {
        txs_per_hour: txsPerHour,
        txs_per_day: txsPerDay,
        risk_distribution: riskDistribution,
        top_wallets: topWallets,
        fee_distribution: feeDistribution,
        size_distribution: sizeDistribution
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnalyticsOverview
};
