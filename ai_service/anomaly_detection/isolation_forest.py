import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "isolation_forest_model.joblib")

class IsolationForestDetector:
    def __init__(self, contamination=0.08, random_state=42):
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            n_estimators=100,
            contamination=self.contamination,
            random_state=self.random_state,
            n_jobs=-1
        )
        self.is_fitted = False
        self._load_or_init()

    def _load_or_init(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.is_fitted = True
            except Exception:
                self._fit_synthetic()
        else:
            self._fit_synthetic()

    def _fit_synthetic(self):
        # Fit model on baseline synthetic transaction features
        np.random.seed(self.random_state)
        normal_data = np.random.normal(loc=[1.5, 1, 2, 0.0001, 3, 5], scale=[1.0, 0.5, 1.0, 0.00005, 1, 2], size=(500, 6))
        normal_data = np.abs(normal_data)
        
        # Add synthetic outliers
        anomalies = np.random.uniform(low=[20.0, 10, 15, 0.01, 20, 30], high=[100.0, 30, 40, 0.1, 50, 80], size=(40, 6))
        dataset = np.vstack([normal_data, anomalies])
        
        self.model.fit(dataset)
        self.is_fitted = True
        try:
            joblib.dump(self.model, MODEL_PATH)
        except Exception:
            pass

    def predict_anomaly(self, feature_vector: list) -> tuple[int, float]:
        """
        Returns (is_anomaly: 1 or -1, anomaly_score: float between 0 and 1)
        """
        vector = np.array(feature_vector).reshape(1, -1)
        if not self.is_fitted:
            self._fit_synthetic()
            
        prediction = self.model.predict(vector)[0] # -1 for outlier, 1 for inlier
        decision_func = self.model.decision_function(vector)[0] # lower score means more anomalous
        
        # Normalize decision function to 0.0 - 1.0 anomaly magnitude
        # Typical decision function output range is approx [-0.5, 0.5]
        normalized_score = float(np.clip((0.5 - decision_func), 0.0, 1.0))
        
        return int(prediction), round(normalized_score, 4)

detector_instance = IsolationForestDetector()
