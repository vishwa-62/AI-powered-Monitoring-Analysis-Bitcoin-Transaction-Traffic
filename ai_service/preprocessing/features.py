def extract_features(tx: dict) -> list:
    """
    Extracts numerical feature vector for IsolationForest anomaly model.
    Feature order:
    0: amount (BTC)
    1: input_count
    2: output_count
    3: fee_ratio (fee / amount)
    4: tx_count_1h
    5: wallet_age_days
    """
    amount = float(tx.get("amount", 1.0))
    input_count = float(tx.get("input_count", 1))
    output_count = float(tx.get("output_count", 1))
    fee = float(tx.get("fee", 0.0001))
    fee_ratio = fee / amount if amount > 0 else 0.0001
    tx_count_1h = float(tx.get("tx_count_1h", 1))
    wallet_age_days = float(tx.get("wallet_age_days", 30))

    return [amount, input_count, output_count, fee_ratio, tx_count_1h, wallet_age_days]
