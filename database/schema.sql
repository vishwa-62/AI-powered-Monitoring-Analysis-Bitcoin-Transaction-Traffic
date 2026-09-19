-- ============================================================================
-- Bitcoin Traffic Intelligence - Database Schema (MySQL)
-- Database Name: bitcoin_monitoring
-- ============================================================================

CREATE DATABASE IF NOT EXISTS bitcoin_monitoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bitcoin_monitoring;

-- ----------------------------------------------------------------------------
-- 1. Users Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS investigation_notes;
DROP TABLE IF EXISTS pattern_detections;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS risk_analysis;
DROP TABLE IF EXISTS wallet_relationships;
DROP TABLE IF EXISTS transaction_outputs;
DROP TABLE IF EXISTS transaction_inputs;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'ANALYST', 'VIEWER') NOT NULL DEFAULT 'ANALYST',
    status ENUM('ACTIVE', 'SUSPENDED', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Wallets Table
-- ----------------------------------------------------------------------------
CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(100) NOT NULL UNIQUE,
    first_seen TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    balance DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    total_received DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    total_sent DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    transaction_count INT NOT NULL DEFAULT 0,
    risk_score INT NOT NULL DEFAULT 0,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    status ENUM('NORMAL', 'MONITORED', 'SUSPICIOUS', 'FLAGGED', 'INVESTIGATING', 'RESOLVED') NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_address (address),
    INDEX idx_risk_score (risk_score),
    INDEX idx_risk_level (risk_level),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Transactions Table
-- ----------------------------------------------------------------------------
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tx_hash VARCHAR(100) NOT NULL UNIQUE,
    block_height INT NOT NULL,
    block_hash VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_input DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    total_output DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    fee DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    size INT NOT NULL DEFAULT 225,
    input_count INT NOT NULL DEFAULT 1,
    output_count INT NOT NULL DEFAULT 1,
    risk_score INT NOT NULL DEFAULT 0,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    status ENUM('NORMAL', 'MONITORED', 'SUSPICIOUS', 'FLAGGED', 'INVESTIGATING', 'RESOLVED') NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tx_hash (tx_hash),
    INDEX idx_block_height (block_height),
    INDEX idx_timestamp (timestamp),
    INDEX idx_risk_score (risk_score),
    INDEX idx_risk_level (risk_level),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Transaction Inputs Table
-- ----------------------------------------------------------------------------
CREATE TABLE transaction_inputs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    wallet_address VARCHAR(100) NOT NULL,
    previous_tx_hash VARCHAR(100) NULL,
    output_index INT DEFAULT 0,
    amount DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    INDEX idx_tx_id (transaction_id),
    INDEX idx_wallet (wallet_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Transaction Outputs Table
-- ----------------------------------------------------------------------------
CREATE TABLE transaction_outputs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    wallet_address VARCHAR(100) NOT NULL,
    amount DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    INDEX idx_tx_id (transaction_id),
    INDEX idx_wallet (wallet_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Wallet Relationships Table
-- ----------------------------------------------------------------------------
CREATE TABLE wallet_relationships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_wallet_id INT NOT NULL,
    target_wallet_id INT NOT NULL,
    transaction_count INT NOT NULL DEFAULT 1,
    total_volume DECIMAL(24, 8) NOT NULL DEFAULT 0.00000000,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (source_wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (target_wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    UNIQUE KEY uq_source_target (source_wallet_id, target_wallet_id),
    INDEX idx_source (source_wallet_id),
    INDEX idx_target (target_wallet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Risk Analysis Table
-- ----------------------------------------------------------------------------
CREATE TABLE risk_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NULL,
    wallet_id INT NULL,
    model_name VARCHAR(100) NOT NULL DEFAULT 'IsolationForest_v1',
    risk_score INT NOT NULL DEFAULT 0,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    anomaly_score DECIMAL(8, 4) NOT NULL DEFAULT 0.0000,
    confidence DECIMAL(5, 2) NOT NULL DEFAULT 95.00,
    explanation TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE SET NULL,
    INDEX idx_tx_id (transaction_id),
    INDEX idx_wallet_id (wallet_id),
    INDEX idx_risk_score (risk_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Alerts Table
-- ----------------------------------------------------------------------------
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type VARCHAR(100) NOT NULL,
    severity ENUM('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    transaction_id INT NULL,
    wallet_id INT NULL,
    risk_score INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    status ENUM('NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED') NOT NULL DEFAULT 'NEW',
    assigned_to INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Pattern Detections Table
-- ----------------------------------------------------------------------------
CREATE TABLE pattern_detections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pattern_type VARCHAR(100) NOT NULL,
    transaction_id INT NULL,
    wallet_id INT NULL,
    confidence DECIMAL(5, 2) NOT NULL DEFAULT 90.00,
    risk_score INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_pattern_type (pattern_type),
    INDEX idx_risk_score (risk_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Investigation Notes Table
-- ----------------------------------------------------------------------------
CREATE TABLE investigation_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    user_id INT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_alert_id (alert_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. Audit Logs Table
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
