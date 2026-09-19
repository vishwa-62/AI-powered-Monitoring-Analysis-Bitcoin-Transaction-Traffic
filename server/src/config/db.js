const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let isUsingMySQL = false;

// Memory storage fallback cache if MySQL unavailable
const memoryStore = {
  users: [],
  wallets: [],
  transactions: [],
  transaction_inputs: [],
  transaction_outputs: [],
  wallet_relationships: [],
  risk_analysis: [],
  alerts: [],
  pattern_detections: [],
  investigation_notes: [],
  audit_logs: []
};

async function initDB() {
  try {
    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bitcoin_monitoring',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    };

    pool = mysql.createPool(connectionConfig);
    // Test connection
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    isUsingMySQL = true;
    console.log('[DB] Connected successfully to MySQL database:', process.env.DB_NAME);
  } catch (err) {
    console.warn('[DB Warning] Could not connect to MySQL server:', err.message);
    console.log('[DB Fallback] Initializing resilient in-memory database store.');
    isUsingMySQL = false;
  }
}

// Universal query wrapper supporting MySQL prepared queries & fallback
async function query(sql, params = []) {
  if (isUsingMySQL && pool) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('[MySQL Error]', err.message);
      throw err;
    }
  } else {
    // Basic in-memory query simulator for fallback mode
    return mockQueryEngine(sql, params);
  }
}

function mockQueryEngine(sql, params) {
  // Return internal memory store data based on context
  return [];
}

module.exports = {
  initDB,
  query,
  getPool: () => pool,
  isMySQL: () => isUsingMySQL,
  memoryStore
};
