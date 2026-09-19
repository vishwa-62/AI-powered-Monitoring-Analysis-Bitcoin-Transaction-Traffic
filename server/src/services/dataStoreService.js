const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');

class DataStoreService {
  constructor() {
    this.users = [];
    this.wallets = [];
    this.transactions = [];
    this.alerts = [];
    this.patterns = [];
    this.investigationNotes = [];
    this.auditLogs = [];
    this.initialized = false;
  }

  async initSeedData() {
    if (this.initialized) return;

    console.log('[DataStore] Generating 1000+ synthetic transactions and 300+ wallets dataset...');

    // 1. Create Demo Users
    const adminPasswordHash = bcrypt.hashSync('Vish@2007@', 10);

    this.users = [
      { id: 1, name: 'System Administrator', email: 'vishwa62@bitcoinintel.com', password_hash: adminPasswordHash, role: 'ADMIN', status: 'ACTIVE', created_at: new Date() }
    ];

    // 2. Generate 320 Wallets
    for (let i = 1; i <= 320; i++) {
      const prefixes = ['1', '3', 'bc1q'];
      const pfx = prefixes[i % prefixes.length];
      const address = pfx + crypto.randomBytes(16).toString('hex').substring(0, 30);
      
      const isHighRisk = i % 8 === 0;
      const isMediumRisk = i % 4 === 0 && !isHighRisk;
      
      let riskScore = Math.floor(Math.random() * 20) + 5;
      let riskLevel = 'LOW';
      let status = 'NORMAL';

      if (isHighRisk) {
        riskScore = Math.floor(Math.random() * 25) + 75; // 75 - 100
        riskLevel = riskScore >= 75 ? 'CRITICAL' : 'HIGH';
        status = i % 2 === 0 ? 'SUSPICIOUS' : 'FLAGGED';
      } else if (isMediumRisk) {
        riskScore = Math.floor(Math.random() * 25) + 40; // 40 - 65
        riskLevel = 'MEDIUM';
        status = 'MONITORED';
      }

      const balance = parseFloat((Math.random() * 120 + 0.1).toFixed(8));
      const totalReceived = parseFloat((balance + Math.random() * 500).toFixed(8));
      const totalSent = parseFloat((totalReceived - balance).toFixed(8));
      const txCount = Math.floor(Math.random() * 80) + 5;

      this.wallets.push({
        id: i,
        address,
        first_seen: new Date(Date.now() - Math.floor(Math.random() * 365 * 86400000)).toISOString(),
        last_seen: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)).toISOString(),
        balance,
        total_received: totalReceived,
        total_sent: totalSent,
        transaction_count: txCount,
        unique_counterparties: Math.floor(txCount * 0.7),
        risk_score: riskScore,
        risk_level: riskLevel,
        status,
        created_at: new Date().toISOString()
      });
    }

    // 3. Generate 1050 Transactions
    for (let i = 1; i <= 1050; i++) {
      const senderObj = this.wallets[Math.floor(Math.random() * this.wallets.length)];
      let receiverObj = this.wallets[Math.floor(Math.random() * this.wallets.length)];
      while (receiverObj.id === senderObj.id) {
        receiverObj = this.wallets[Math.floor(Math.random() * this.wallets.length)];
      }

      const txHash = '00000000' + crypto.randomBytes(28).toString('hex');
      const blockHeight = 860000 + Math.floor(i / 3);
      const isAnomaly = i % 9 === 0 || senderObj.risk_level === 'CRITICAL';
      
      let amount = parseFloat((Math.random() * 3.5 + 0.01).toFixed(8));
      let fee = parseFloat((Math.random() * 0.0003 + 0.00005).toFixed(8));
      let inputCount = Math.floor(Math.random() * 2) + 1;
      let outputCount = Math.floor(Math.random() * 2) + 1;
      
      let riskScore = Math.floor(Math.random() * 20) + 5;
      let riskLevel = 'LOW';
      let status = 'NORMAL';
      let aiReasons = ['Standard transaction volume'];
      let patterns = [];

      if (isAnomaly) {
        riskScore = Math.floor(Math.random() * 30) + 70;
        riskLevel = riskScore >= 75 ? 'CRITICAL' : 'HIGH';
        status = i % 2 === 0 ? 'FLAGGED' : 'SUSPICIOUS';
        amount = parseFloat((Math.random() * 75 + 25).toFixed(8));
        inputCount = Math.floor(Math.random() * 10) + 5;
        outputCount = Math.floor(Math.random() * 12) + 6;
        
        aiReasons = [
          'High-value BTC transfer exceeding 25 BTC threshold',
          'Fan-out dispersion structure detected',
          'Abnormal counterparty degree centrality'
        ];

        patterns.push({
          pattern_name: 'Structuring-Like Transaction Pattern',
          description: 'Splitting large amounts into lower threshold outputs.',
          confidence: 91.5,
          risk_score: riskScore,
          code: 'STRUCTURING'
        });
      }

      const timestamp = new Date(Date.now() - (1050 - i) * 600000).toISOString(); // spread over past ~7 days

      const txObj = {
        id: i,
        tx_hash: txHash,
        block_height: blockHeight,
        block_hash: '0000000000000000000' + crypto.randomBytes(22).toString('hex'),
        timestamp,
        sender: senderObj.address,
        receiver: receiverObj.address,
        total_input: amount + fee,
        total_output: amount,
        amount,
        usd_value: parseFloat((amount * 65000).toFixed(2)),
        fee,
        size: Math.floor(Math.random() * 350) + 180,
        input_count: inputCount,
        output_count: outputCount,
        risk_score: riskScore,
        risk_level: riskLevel,
        status,
        ai_reasons: aiReasons,
        patterns,
        created_at: timestamp
      };

      this.transactions.push(txObj);

      // Create alerts for high/critical transactions
      if (riskScore >= 50) {
        this.alerts.push({
          id: this.alerts.length + 1,
          alert_type: patterns.length ? patterns[0].pattern_name : 'Suspicious Transaction Activity',
          severity: riskLevel,
          transaction_id: i,
          tx_hash: txHash,
          wallet_address: senderObj.address,
          risk_score: riskScore,
          description: `High-risk transaction detected: ${amount.toFixed(2)} BTC transferred from ${senderObj.address.substring(0, 10)}...`,
          status: i % 3 === 0 ? 'RESOLVED' : (i % 2 === 0 ? 'INVESTIGATING' : 'NEW'),
          assigned_to: i % 2 === 0 ? 2 : null,
          assigned_user: i % 2 === 0 ? 'Lead Security Analyst' : 'Unassigned',
          created_at: timestamp,
          updated_at: timestamp
        });
      }
    }

    // 4. Initial Audit Log
    this.auditLogs.push({
      id: 1,
      user_id: 1,
      user_name: 'System Administrator',
      action: 'SYSTEM_BOOTSTRAP',
      entity_type: 'SYSTEM',
      entity_id: '1',
      metadata: JSON.stringify({ message: 'Dataset loaded with 1050 transactions and 320 wallets' }),
      created_at: new Date().toISOString()
    });

    this.initialized = true;
    console.log(`[DataStore] Dataset loaded successfully: ${this.transactions.length} transactions, ${this.wallets.length} wallets, ${this.alerts.length} alerts.`);
  }

  addTransaction(tx) {
    tx.id = this.transactions.length + 1;
    this.transactions.unshift(tx);
    if (this.transactions.length > 2000) this.transactions.pop();
  }

  addAlert(alert) {
    this.alerts.unshift(alert);
  }

  getNextAlertId() {
    return this.alerts.length + 1;
  }
}

module.exports = new DataStoreService();
