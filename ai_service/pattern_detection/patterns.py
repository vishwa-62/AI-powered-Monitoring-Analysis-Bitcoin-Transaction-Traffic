def detect_analytical_patterns(tx_data: dict, wallet_context: dict = None) -> list:
    """
    Detects 12 specific blockchain transaction traffic patterns.
    Returns list of pattern detection objects with confidence, risk score, and descriptions.
    """
    detected_patterns = []

    amount = float(tx_data.get("amount", 0.0))
    fee = float(tx_data.get("fee", 0.0))
    input_count = int(tx_data.get("input_count", 1))
    output_count = int(tx_data.get("output_count", 1))
    tx_count_1h = int(tx_data.get("tx_count_1h", 1))
    wallet_age_days = int(tx_data.get("wallet_age_days", 30))
    dormant_days = int(tx_data.get("dormant_days", 0))
    degree = int(tx_data.get("degree", 2))
    time_delta_seconds = float(tx_data.get("time_delta_seconds", 3600.0))
    repeated_tx_count = int(tx_data.get("repeated_tx_count", 0))
    has_circular = bool(tx_data.get("has_circular", False))

    # 1. Burst transaction activity
    if tx_count_1h > 8:
        detected_patterns.append({
            "pattern_name": "Burst Transaction Activity",
            "description": f"Detected high transaction burst frequency ({tx_count_1h} transactions in 1 hour).",
            "confidence": 92.5,
            "risk_score": 75,
            "code": "BURST_ACTIVITY"
        })

    # 2. Rapid fund movement
    if time_delta_seconds < 120 and amount > 2.0:
        detected_patterns.append({
            "pattern_name": "Rapid Fund Movement",
            "description": f"Funds moved within {int(time_delta_seconds)}s of arrival across wallet hops.",
            "confidence": 88.0,
            "risk_score": 70,
            "code": "RAPID_MOVEMENT"
        })

    # 3. Circular transaction paths
    if has_circular:
        detected_patterns.append({
            "pattern_name": "Circular Transaction Path",
            "description": "Detected closed-loop transaction routing returning funds back to originating cluster.",
            "confidence": 95.0,
            "risk_score": 85,
            "code": "CIRCULAR_PATH"
        })

    # 4. Repeated transfers
    if repeated_tx_count >= 5:
        detected_patterns.append({
            "pattern_name": "Repeated Transfers",
            "description": f"Identified {repeated_tx_count} identical transfers between same counterparties.",
            "confidence": 90.0,
            "risk_score": 55,
            "code": "REPEATED_TRANSFERS"
        })

    # 5. Unusual transaction amounts
    if amount > 50.0 or (amount > 10.0 and fee < 0.00001):
        detected_patterns.append({
            "pattern_name": "Unusual Transaction Amount",
            "description": f"Transaction volume of {amount:.2f} BTC significantly deviates from network mean.",
            "confidence": 91.0,
            "risk_score": 68,
            "code": "UNUSUAL_AMOUNT"
        })

    # 6. Sudden wallet activity
    if wallet_age_days < 3 and amount > 5.0:
        detected_patterns.append({
            "pattern_name": "Sudden Wallet Activity",
            "description": f"New wallet ({wallet_age_days} days old) initiated substantial transfers ({amount:.2f} BTC).",
            "confidence": 87.5,
            "risk_score": 65,
            "code": "SUDDEN_ACTIVITY"
        })

    # 7. High-degree wallet behavior
    if degree >= 15:
        detected_patterns.append({
            "pattern_name": "High-Degree Wallet Behavior",
            "description": f"Wallet interacts with {degree} distinct network counterparties.",
            "confidence": 94.0,
            "risk_score": 60,
            "code": "HIGH_DEGREE"
        })

    # 8. Fan-in pattern
    if input_count >= 5 and output_count <= 2:
        detected_patterns.append({
            "pattern_name": "Fan-In Aggregation Pattern",
            "description": f"Consolidation of {input_count} distinct inputs into {output_count} destination wallet(s).",
            "confidence": 93.0,
            "risk_score": 72,
            "code": "FAN_IN"
        })

    # 9. Fan-out pattern
    if input_count <= 2 and output_count >= 5:
        detected_patterns.append({
            "pattern_name": "Fan-Out Dispersion Pattern",
            "description": f"Dispersion from {input_count} source into {output_count} distinct outputs.",
            "confidence": 93.0,
            "risk_score": 72,
            "code": "FAN_OUT"
        })

    # 10. Structuring-like transaction patterns
    if 0.95 <= (amount * 100) % 1.0 <= 0.99 or (output_count >= 4 and amount / output_count > 0.9 and amount / output_count < 1.0):
        detected_patterns.append({
            "pattern_name": "Structuring-Like Transaction Pattern",
            "description": "Transaction splits amounts right below standard analytical reporting thresholds.",
            "confidence": 89.0,
            "risk_score": 82,
            "code": "STRUCTURING"
        })

    # 11. Dormant wallet reactivation
    if dormant_days > 180 and amount > 1.0:
        detected_patterns.append({
            "pattern_name": "Dormant Wallet Reactivation",
            "description": f"Wallet inactive for {dormant_days} days suddenly transferred {amount:.2f} BTC.",
            "confidence": 96.0,
            "risk_score": 78,
            "code": "DORMANT_REACTIVATION"
        })

    # 12. Abnormal transaction timing
    if tx_data.get("is_off_peak", False) and amount > 8.0:
        detected_patterns.append({
            "pattern_name": "Abnormal Transaction Timing",
            "description": "High-volume transfer during statistically low network activity window.",
            "confidence": 84.0,
            "risk_score": 50,
            "code": "ABNORMAL_TIMING"
        })

    return detected_patterns
