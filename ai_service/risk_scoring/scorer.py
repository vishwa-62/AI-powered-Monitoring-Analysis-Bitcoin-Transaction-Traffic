import numpy as np

def calculate_risk_level(score: int) -> str:
    """
    Score ranges:
    0-24: LOW
    25-49: MEDIUM
    50-74: HIGH
    75-100: CRITICAL
    """
    if score >= 75:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 25:
        return "MEDIUM"
    else:
        return "LOW"

def compute_transaction_risk(features: dict, anomaly_score: float) -> dict:
    """
    Computes analytical risk score (0-100) based on features and anomaly score.
    Returns score, level, and analytical indicator reasons.
    DISCLAIMER: AI indicators are analytical risk scores, not criminal proof.
    """
    base_score = int(np.clip((1.0 - anomaly_score) * 100, 0, 100)) if anomaly_score < 0 else int(np.clip(anomaly_score * 100, 0, 100))
    
    reasons = []
    
    # Quantitative heuristic adjustments
    amount = features.get("amount", 0.0)
    input_count = features.get("input_count", 1)
    output_count = features.get("output_count", 1)
    fee_ratio = features.get("fee_ratio", 0.0)
    burst_flag = features.get("burst_flag", False)
    circular_flag = features.get("circular_flag", False)
    rapid_movement = features.get("rapid_movement", False)
    degree = features.get("degree", 0)

    if amount > 50.0:
        base_score += 15
        reasons.append("High-value BTC transfer exceeding 50 BTC threshold")
    elif amount > 10.0:
        base_score += 8
        reasons.append("Elevated transaction value (>10 BTC)")

    if input_count > 10 and output_count == 1:
        base_score += 12
        reasons.append("Fan-in transaction structure (multiple inputs consolidated into single output)")

    if input_count == 1 and output_count > 10:
        base_score += 12
        reasons.append("Fan-out transaction structure (single input split to multiple outputs)")

    if fee_ratio > 0.05:
        base_score += 10
        reasons.append("Unusually high transaction fee relative to transferred amount")
    elif fee_ratio < 0.00001 and amount > 5.0:
        base_score += 5
        reasons.append("Abnormally low fee for substantial transaction size")

    if burst_flag:
        base_score += 18
        reasons.append("Unusual transaction frequency burst within tight time window")

    if circular_flag:
        base_score += 25
        reasons.append("Circular transaction routing detected across wallet cluster")

    if rapid_movement:
        base_score += 20
        reasons.append("Rapid fund movement across consecutive hops")

    if degree > 15:
        base_score += 10
        reasons.append("High-degree node interactions within transaction graph")

    final_score = int(np.clip(base_score, 0, 100))
    risk_level = calculate_risk_level(final_score)

    if not reasons:
        reasons.append("Standard transaction metrics within normal statistical parameters")

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "anomaly_score": round(float(anomaly_score), 4),
        "reasons": reasons,
        "disclaimer": "AI-generated risk scores are analytical indicators for traffic monitoring and do not constitute legal or criminal evidence."
    }
