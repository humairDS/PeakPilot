"""
Live ML recommendation engine.

Loads the trained models produced by ml/training/train_models.py
(cached in-process after first load) and turns a user's profile into:
    - a predicted daily calorie target (regression)
    - a predicted workout intensity: Low / Moderate / High (classification)
    - a macro split (protein/carbs/fat) derived from the predicted calories

Falls back to the deterministic BMR/TDEE rule-based calculation
(ml/bmr.py) if the trained model files aren't present, so the feature
never hard-fails even before training has been run.
"""

import os
import joblib
import pandas as pd

from ml.bmr import rule_based_recommendation, calculate_macros

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")

FEATURE_COLUMNS = [
    "age", "height", "weight", "goal_weight", "workout_days", "sleep", "water",
    "gender", "goal", "activity",
]

REQUIRED_FIELDS = ["age", "height", "weight", "gender"]

_models = {"calorie": None, "intensity": None, "loaded": False}


def _load_models():
    if _models["loaded"]:
        return

    calorie_path = os.path.join(MODELS_DIR, "calorie_model.joblib")
    intensity_path = os.path.join(MODELS_DIR, "intensity_model.joblib")

    if os.path.exists(calorie_path):
        _models["calorie"] = joblib.load(calorie_path)

    if os.path.exists(intensity_path):
        _models["intensity"] = joblib.load(intensity_path)

    _models["loaded"] = True


def _missing_fields(profile):
    return [field for field in REQUIRED_FIELDS if not profile.get(field)]


def _build_feature_row(profile):
    return pd.DataFrame([{
        "age": profile.get("age"),
        "height": profile.get("height"),
        "weight": profile.get("weight"),
        "goal_weight": profile.get("goal_weight") or profile.get("weight"),
        "workout_days": profile.get("workout_days") or 3,
        "sleep": profile.get("sleep") or 7,
        "water": profile.get("water") or 2.5,
        "gender": (profile.get("gender") or "male"),
        "goal": (profile.get("goal") or "maintenance"),
        "activity": (profile.get("activity") or "moderately active"),
    }])[FEATURE_COLUMNS]


def get_recommendation(profile):
    """
    profile: dict with keys age, gender, height, weight, goal_weight,
             goal, activity, workout_days, sleep, water
             (matches the User model / /get_profile response shape)

    Returns a dict describing the recommendation, or an error dict
    if required profile fields are missing.
    """
    missing = _missing_fields(profile)

    if missing:
        return {
            "success": False,
            "message": (
                "Complete your profile (age, height, weight, gender) to "
                "unlock ML-powered recommendations."
            ),
            "missing_fields": missing,
        }

    _load_models()

    row = _build_feature_row(profile)

    macros = calculate_macros(0, profile.get("goal"))  # placeholder, recomputed below

    if _models["calorie"] is not None and _models["intensity"] is not None:
        target_calories = float(_models["calorie"].predict(row)[0])
        workout_intensity = str(_models["intensity"].predict(row)[0])

        macros = calculate_macros(target_calories, profile.get("goal"))

        return {
            "success": True,
            "source": "ml_model",
            "target_calories": round(target_calories),
            "workout_intensity": workout_intensity,
            "macros": macros,
        }

    # ---- Fallback: deterministic rule-based calculation ----
    fallback = rule_based_recommendation(
        weight=profile.get("weight"),
        height=profile.get("height"),
        age=profile.get("age"),
        gender=profile.get("gender"),
        activity=profile.get("activity"),
        goal=profile.get("goal"),
    )

    return {
        "success": True,
        "source": "rule_based_fallback",
        "target_calories": fallback["target_calories"],
        "workout_intensity": None,
        "macros": {
            "protein": fallback["protein"],
            "carbs": fallback["carbs"],
            "fat": fallback["fat"],
        },
        "note": (
            "Trained model files not found — using formula-based fallback. "
            "Run ml/training/train_models.py to enable full ML predictions."
        ),
    }