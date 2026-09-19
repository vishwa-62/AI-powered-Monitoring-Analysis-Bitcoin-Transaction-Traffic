from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import numpy as np

from preprocessing.features import extract_features
from anomaly_detection.isolation_forest import detector_instance
from risk_scoring.scorer import compute_transaction_risk, calculate_risk_level
from pattern_detection.patterns import detect_analytical_patterns
from network_analysis.graph import analyze_transaction_network

app = FastAPI(
    title="Bitcoin Traffic Intelligence AI Engine",
    description="FastAPI REST service for AI/ML anomaly detection, risk scoring, pattern analysis, and NetworkX network analysis.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionAnalysisRequest(BaseModel):
    tx_hash: Optional[str] = "0x..."
    amount: float = 1.0
    fee: float = 0.0001
    input_count: int = 1
    output_count: int = 1
    tx_count_1h: int = 1
    wallet_age_days: int = 30
    dormant_days: int = 0
    degree: int = 2
    time_delta_seconds: float = 3600.0
    repeated_tx_count: int = 0
    has_circular: bool = False

class WalletAnalysisRequest(BaseModel):
    address: str
    balance: float = 0.0
    total_received: float = 0.0
    total_sent: float = 0.0
    transaction_count: int = 0
    unique_counterparties: int = 0
    dormant_days: int = 0

class NetworkGraphRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get("/")
def root():
    return {
        "service": "Bitcoin Traffic Intelligence AI Service",
        "status": "ONLINE",
        "models": ["IsolationForest", "NetworkX_GraphCentrality", "AnalyticalPatternMatcher"]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/analyze/transaction")
def analyze_transaction(req: TransactionAnalysisRequest):
    tx_dict = req.dict()
    feature_vector = extract_features(tx_dict)
    prediction, anomaly_score = detector_instance.predict_anomaly(feature_vector)
    
    risk_data = compute_transaction_risk(tx_dict, anomaly_score)
    patterns = detect_analytical_patterns(tx_dict)
    
    return {
        "tx_hash": req.tx_hash,
        "is_anomaly": True if prediction == -1 or anomaly_score > 0.4 else False,
        "anomaly_score": anomaly_score,
        "risk_score": risk_data["risk_score"],
        "risk_level": risk_data["risk_level"],
        "reasons": risk_data["reasons"],
        "patterns": patterns,
        "disclaimer": risk_data["disclaimer"]
    }

@app.post("/analyze/wallet")
def analyze_wallet(req: WalletAnalysisRequest):
    w = req.dict()
    
    score = 15
    reasons = []
    
    if req.transaction_count > 100:
        score += 15
        reasons.append("High volume transaction history (>100 transactions)")
        
    if req.unique_counterparties > 50:
        score += 20
        reasons.append("Wide counterparty fan-out network")
        
    if req.dormant_days > 180 and req.balance > 10.0:
        score += 30
        reasons.append("High balance in previously dormant wallet")
        
    if req.total_received > 100.0 or req.total_sent > 100.0:
        score += 15
        reasons.append("High lifetime BTC flow exceeding 100 BTC")

    final_score = int(np.clip(score, 0, 100))
    risk_level = calculate_risk_level(final_score)
    
    return {
        "address": req.address,
        "risk_score": final_score,
        "risk_level": risk_level,
        "reasons": reasons if reasons else ["Normal wallet behavior parameters"],
        "disclaimer": "AI analytical indicator score"
    }

@app.post("/analyze/network")
def analyze_network(req: NetworkGraphRequest):
    res = analyze_transaction_network(req.nodes, req.edges)
    return res

@app.get("/anomalies")
def get_recent_anomalies():
    # Return synthetic anomaly distribution overview
    return {
        "total_analyzed": 1420,
        "anomalies_detected": 118,
        "high_risk_count": 84,
        "critical_risk_count": 34,
        "high_risk_wallets": 42
    }

@app.get("/risk-distribution")
def get_risk_distribution():
    return {
        "LOW": 650,
        "MEDIUM": 420,
        "HIGH": 230,
        "CRITICAL": 120
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
