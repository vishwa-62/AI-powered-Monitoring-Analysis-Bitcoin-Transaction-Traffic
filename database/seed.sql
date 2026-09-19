-- ============================================================================
-- Bitcoin Traffic Intelligence - Database Seed Script
-- Database Name: bitcoin_monitoring
-- ============================================================================

USE bitcoin_monitoring;

-- Disable foreign key checks for clean seed insertion
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE investigation_notes;
TRUNCATE TABLE pattern_detections;
TRUNCATE TABLE alerts;
TRUNCATE TABLE risk_analysis;
TRUNCATE TABLE wallet_relationships;
TRUNCATE TABLE transaction_outputs;
TRUNCATE TABLE transaction_inputs;
TRUNCATE TABLE transactions;
TRUNCATE TABLE wallets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Demo User (bcrypt hash for Vish@2007@)
INSERT INTO users (id, name, email, password_hash, role, status) VALUES
(1, 'System Administrator', 'vishwa62@bitcoinintel.com', '$2a$10$jN1ZuAA3PRRF.BQ2Fx9G.OuOueCgIWQqsfI7q7v2qDHiEcqHoIQXy', 'ADMIN', 'ACTIVE');

-- 2. Insert Core Wallets
INSERT INTO wallets (id, address, balance, total_received, total_sent, transaction_count, risk_score, risk_level, status) VALUES
(1, '1bc1q_alpha_master_wallet_01', 120.50000000, 550.00000000, 429.50000000, 85, 88, 'CRITICAL', 'FLAGGED'),
(2, '3btc_beta_mixer_node_02', 45.25000000, 310.00000000, 264.75000000, 62, 68, 'HIGH', 'SUSPICIOUS'),
(3, '1bc1q_gamma_exchange_hot_03', 890.12000000, 12500.00000000, 11609.88000000, 1420, 12, 'LOW', 'NORMAL'),
(4, 'bc1q_delta_layering_hop_04', 15.80000000, 88.00000000, 72.20000000, 24, 82, 'CRITICAL', 'INVESTIGATING'),
(5, '3btc_epsilon_unidentified_05', 5.40000000, 32.10000000, 26.70000000, 18, 45, 'MEDIUM', 'MONITORED');

-- 3. Insert Sample Transactions
INSERT INTO transactions (id, tx_hash, block_height, block_hash, timestamp, total_input, total_output, fee, size, input_count, output_count, risk_score, risk_level, status) VALUES
(1, '00000000a1b2c3d4e5f678901234567890abcdef1234567890abcdef12345678', 860420, '0000000000000000000a1b2c3d4e5f678901234567890abcdef', '2026-09-07 18:42:10', 42.50020000, 42.50000000, 0.00020000, 225, 1, 2, 88, 'CRITICAL', 'FLAGGED'),
(2, '00000000b2c3d4e5f678901234567890abcdef1234567890abcdef12345679', 860421, '0000000000000000000b2c3d4e5f678901234567890abcdef', '2026-09-07 18:45:00', 12.00015000, 12.00000000, 0.00015000, 225, 1, 1, 15, 'LOW', 'NORMAL');

-- 4. Insert Transaction Inputs & Outputs
INSERT INTO transaction_inputs (transaction_id, wallet_address, amount) VALUES
(1, '1bc1q_alpha_master_wallet_01', 42.50020000),
(2, '3btc_beta_mixer_node_02', 12.00015000);

INSERT INTO transaction_outputs (transaction_id, wallet_address, amount) VALUES
(1, '3btc_beta_mixer_node_02', 42.50000000),
(2, '1bc1q_gamma_exchange_hot_03', 12.00000000);

-- 5. Insert Pattern Detections
INSERT INTO pattern_detections (pattern_type, transaction_id, wallet_id, confidence, risk_score, description) VALUES
('Structuring-Like Transaction Pattern', 1, 1, 91.50, 88, 'Splitting large amounts into lower threshold outputs.'),
('Burst Transaction Activity', 1, 1, 94.00, 85, 'Unusual transaction frequency burst within tight time window.');

-- 6. Insert Alerts
INSERT INTO alerts (id, alert_type, severity, transaction_id, wallet_id, risk_score, description, status, assigned_to) VALUES
(1, 'Structuring-Like Transaction Pattern', 'CRITICAL', 1, 1, 88, 'High-risk transaction detected: 42.50 BTC transferred from 1bc1q_alpha...', 'INVESTIGATING', 2);

-- 7. Insert Investigation Notes
INSERT INTO investigation_notes (alert_id, user_id, note) VALUES
(1, 2, 'Initiated cluster tracing on wallet 1bc1q_alpha_master_wallet_01. Requested Exchange KYC audit.');

-- 8. Insert Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata) VALUES
(1, 'SYSTEM_SEED_INITIALIZATION', 'SYSTEM', '1', '{"message": "Database seeded with schema DDL and baseline records."}');
