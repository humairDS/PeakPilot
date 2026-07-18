"""
Trains PeakPilot's ML recommendation models:

1. Regression model -> predicts daily target_calories
2. Classification model -> predicts workout_intensity (Low/Moderate/High)

Both models are trained on ml/dataset/fitness_dataset.csv (see
ml/training/generate_dataset.py). Trained artifacts + a fitted
preprocessing encoder are saved to ml/saved_models/, and accuracy
metrics are written to ml/saved_models/metrics.json so the app can
display them (see ml/accuracy.py and routes/ml_routes.py).

Run (from the backend/ directory):
    python -m ml.training.train_models
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    mean_absolute_error,
    r2_score,
    accuracy_score,
    f1_score,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "fitness_dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")

NUMERIC_FEATURES = ["age", "height", "weight", "goal_weight", "workout_days", "sleep", "water"]
CATEGORICAL_FEATURES = ["gender", "goal", "activity"]

RANDOM_STATE = 42


def build_preprocessor():
    return ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
        ],
        remainder="passthrough",
    )


def train_calorie_model(X_train, X_test, y_train, y_test):
    pipeline = Pipeline(steps=[
        ("preprocess", build_preprocessor()),
        ("model", RandomForestRegressor(
            n_estimators=300,
            max_depth=12,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        )),
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    metrics = {
        "mae": round(float(mae), 2),
        "r2_score": round(float(r2), 4),
        "test_samples": int(len(y_test)),
    }

    return pipeline, metrics


def train_intensity_model(X_train, X_test, y_train, y_test):
    pipeline = Pipeline(steps=[
        ("preprocess", build_preprocessor()),
        ("model", RandomForestClassifier(
            n_estimators=300,
            max_depth=12,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            class_weight="balanced",
        )),
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)
    f1 = f1_score(y_test, predictions, average="macro")

    metrics = {
        "accuracy": round(float(accuracy), 4),
        "f1_macro": round(float(f1), 4),
        "test_samples": int(len(y_test)),
        "classes": sorted(pd.unique(y_test).tolist()),
    }

    return pipeline, metrics


def main():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(
            f"Dataset not found at {DATASET_PATH}. "
            "Run `python -m ml.training.generate_dataset` first."
        )

    df = pd.read_csv(DATASET_PATH)

    feature_cols = NUMERIC_FEATURES + CATEGORICAL_FEATURES
    X = df[feature_cols]

    # ---- Calorie regression model ----
    y_calories = df["target_calories"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_calories, test_size=0.2, random_state=RANDOM_STATE
    )

    calorie_pipeline, calorie_metrics = train_calorie_model(
        X_train, X_test, y_train, y_test
    )

    # ---- Workout intensity classification model ----
    y_intensity = df["workout_intensity"]

    X_train2, X_test2, y_train2, y_test2 = train_test_split(
        X, y_intensity, test_size=0.2, random_state=RANDOM_STATE, stratify=y_intensity
    )

    intensity_pipeline, intensity_metrics = train_intensity_model(
        X_train2, X_test2, y_train2, y_test2
    )

    os.makedirs(MODELS_DIR, exist_ok=True)

    joblib.dump(calorie_pipeline, os.path.join(MODELS_DIR, "calorie_model.joblib"))
    joblib.dump(intensity_pipeline, os.path.join(MODELS_DIR, "intensity_model.joblib"))

    metrics = {
        "calorie_model": {
            "type": "RandomForestRegressor",
            **calorie_metrics,
        },
        "intensity_model": {
            "type": "RandomForestClassifier",
            **intensity_metrics,
        },
        "feature_columns": feature_cols,
        "training_samples": int(len(df)),
    }

    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(json.dumps(metrics, indent=2))
    print(f"\nModels saved to {MODELS_DIR}")


if __name__ == "__main__":
    main()