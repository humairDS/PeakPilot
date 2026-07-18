"""
Exposes the evaluation metrics produced by ml/training/train_models.py.

These are computed once at training time (on a held-out 20% test split)
and cached to disk, rather than recomputed on every request.
"""

import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
METRICS_PATH = os.path.join(BASE_DIR, "saved_models", "metrics.json")

_cache = None


def get_model_metrics():
    global _cache

    if _cache is not None:
        return _cache

    if not os.path.exists(METRICS_PATH):
        return {
            "available": False,
            "message": (
                "No trained model metrics found. Run "
                "`python -m ml.training.generate_dataset` then "
                "`python -m ml.training.train_models` from the backend/ directory."
            ),
        }

    with open(METRICS_PATH) as f:
        metrics = json.load(f)

    metrics["available"] = True
    _cache = metrics

    return metrics