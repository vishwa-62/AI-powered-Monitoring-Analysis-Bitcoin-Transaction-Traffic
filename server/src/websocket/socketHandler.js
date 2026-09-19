const bitcoinProvider = require('../providers/bitcoinProvider');
const aiService = require('../services/aiService');
const dataStore = require('../services/dataStoreService');

let ioInstance = null;
let monitoringInterval = null;

function initSocketIO(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('[WebSocket] Client connected:', socket.id);

    socket.emit('connection_status', {
      connected: true,
      monitoring_status: 'ACTIVE',
      timestamp: new Date().toISOString()
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Client disconnected:', socket.id);
    });
  });

  startMonitoringService();
}

function startMonitoringService() {
  if (monitoringInterval) clearInterval(monitoringInterval);

  console.log('[Monitoring Engine] Background Bitcoin traffic monitoring started.');

  // Emit a real-time transaction every 4 seconds
  monitoringInterval = setInterval(async () => {
    try {
      const rawTx = bitcoinProvider.generateSyntheticTransaction();
      const aiResult = await aiService.analyzeTransaction({
        tx_hash: rawTx.tx_hash,
        amount: rawTx.amount,
        fee: rawTx.fee,
        input_count: rawTx.input_count,
        output_count: rawTx.output_count,
        tx_count_1h: Math.floor(Math.random() * 5) + 1
      });

      const processedTx = {
        ...rawTx,
        risk_score: aiResult.risk_score,
        risk_level: aiResult.risk_level,
        status: aiResult.risk_level === 'CRITICAL' ? 'FLAGGED' : (aiResult.risk_level === 'HIGH' ? 'SUSPICIOUS' : 'NORMAL'),
        ai_reasons: aiResult.reasons,
        patterns: aiResult.patterns
      };

      // Add to memory data store
      dataStore.addTransaction(processedTx);

      // If high/critical risk, create alert & pattern
      if (processedTx.risk_score >= 50 && ioInstance) {
        const newAlert = {
          id: dataStore.getNextAlertId(),
          alert_type: aiResult.patterns.length ? aiResult.patterns[0].pattern_name : 'High Risk Transaction',
          severity: processedTx.risk_level,
          tx_hash: processedTx.tx_hash,
          wallet_address: processedTx.sender,
          risk_score: processedTx.risk_score,
          description: `Transaction ${processedTx.tx_hash.substring(0, 10)}... flagged with risk score ${processedTx.risk_score} (${processedTx.risk_level}).`,
          status: 'NEW',
          created_at: new Date().toISOString()
        };

        dataStore.addAlert(newAlert);
        ioInstance.emit('new_alert', newAlert);
      }

      if (ioInstance) {
        ioInstance.emit('new_transaction', processedTx);
      }
    } catch (err) {
      console.error('[Monitoring Engine Error]', err.message);
    }
  }, 4000);
}

module.exports = {
  initSocketIO,
  getIO: () => ioInstance
};
