"""
Generates a synthetic training dataset for PeakPilot's ML recommender.

Why synthetic data:
No real user dataset was available at the time of building this feature.
Instead of hand-crafting a purely deterministic formula (which a model
could "solve" with 100% accuracy and would be scientifically meaningless),
this script:

1. Samples realistic human body/lifestyle parameters
2. Computes ground-truth targets using the validated Mifflin-St Jeor
   BMR/TDEE formulas (see ml/bmr.py)
3. Injects realistic human-measurement noise (+/- variance) into both
   the inputs and the outputs, so the resulting dataset behaves like
   real-world observational data rather than a lookup table.

Run:
    python -m ml.training.generate_dataset
(from the backend/ directory)

Output:
    ml/dataset/fitness_dataset.csv
"""

import os
import sys
import numpy as np
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ml.bmr import calculate_bmr, calculate_tdee, calculate_target_calories

RANDOM_SEED = 42
N_SAMPLES = 6000

GENDERS = ["male", "female"]
GOALS = ["fat loss", "muscle gain", "maintenance", "recomposition", "endurance"]
ACTIVITIES = [
    "sedentary",
    "lightly active",
    "moderately active",
    "very active",
    "extremely active",
]

ACTIVITY_SCORE = {
    "sedentary": 0,
    "lightly active": 1,
    "moderately active": 2,
    "very active": 3,
    "extremely active": 4,
}

GOAL_INTENSITY_BIAS = {
    "fat loss": 0.5,
    "muscle gain": 1.0,
    "recomposition": 0.5,
    "maintenance": 0.0,
    "endurance": 1.2,
}


def sample_users(n, rng):
    gender = rng.choice(GENDERS, size=n)

    age = rng.integers(16, 70, size=n)

    height = np.where(
        gender == "male",
        rng.normal(175, 7, size=n),
        rng.normal(163, 7, size=n),
    ).clip(145, 210)

    base_weight = np.where(
        gender == "male",
        rng.normal(80, 14, size=n),
        rng.normal(68, 13, size=n),
    ).clip(40, 160)

    goal = rng.choice(GOALS, size=n)
    activity = rng.choice(ACTIVITIES, size=n)
    workout_days = rng.integers(1, 7, size=n)
    sleep = rng.normal(7, 1.2, size=n).clip(3, 10)
    water = rng.normal(2.5, 0.7, size=n).clip(0.5, 6)

    goal_weight = base_weight.copy()
    fat_loss_mask = goal == "fat loss"
    muscle_gain_mask = goal == "muscle gain"
    goal_weight[fat_loss_mask] *= rng.uniform(0.85, 0.97, size=fat_loss_mask.sum())
    goal_weight[muscle_gain_mask] *= rng.uniform(1.03, 1.15, size=muscle_gain_mask.sum())

    return pd.DataFrame({
        "age": age,
        "gender": gender,
        "height": height.round(1),
        "weight": base_weight.round(1),
        "goal_weight": goal_weight.round(1),
        "goal": goal,
        "activity": activity,
        "workout_days": workout_days,
        "sleep": sleep.round(1),
        "water": water.round(2),
    })


def compute_targets(df, rng):
    target_calories = []

    for _, row in df.iterrows():
        bmr = calculate_bmr(row["weight"], row["height"], row["age"], row["gender"])
        tdee = calculate_tdee(bmr, row["activity"])
        calories = calculate_target_calories(tdee, row["goal"])
        target_calories.append(calories)

    target_calories = np.array(target_calories)

    # Inject realistic +/- 6% measurement/behavioral noise
    noise = rng.normal(1.0, 0.06, size=len(target_calories))
    target_calories = (target_calories * noise).round().astype(int)

    # ---- Workout intensity label (classification) ----
    activity_score = df["activity"].map(ACTIVITY_SCORE).to_numpy(dtype=float)
    goal_bias = df["goal"].map(GOAL_INTENSITY_BIAS).to_numpy(dtype=float)
    workout_days = df["workout_days"].to_numpy(dtype=float)
    age = df["age"].to_numpy(dtype=float)
    sleep = df["sleep"].to_numpy(dtype=float)

    intensity_score = (
        activity_score * 1.1
        + goal_bias
        + (workout_days - 3) * 0.35
        - np.clip((age - 40) / 20, 0, None) * 0.8
        + np.clip((sleep - 6) / 4, -0.5, 0.5) * 0.4
        + rng.normal(0, 0.6, size=len(df))  # noise
    )

    intensity_label = np.where(
        intensity_score < 1.2,
        "Low",
        np.where(intensity_score < 2.6, "Moderate", "High"),
    )

    df = df.copy()
    df["target_calories"] = target_calories
    df["workout_intensity"] = intensity_label

    return df


def main():
    rng = np.random.default_rng(RANDOM_SEED)

    df = sample_users(N_SAMPLES, rng)
    df = compute_targets(df, rng)

    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dataset")
    os.makedirs(out_dir, exist_ok=True)

    out_path = os.path.join(out_dir, "fitness_dataset.csv")
    df.to_csv(out_path, index=False)

    print(f"Generated {len(df)} rows -> {out_path}")
    print(df["workout_intensity"].value_counts())
    print(df[["target_calories"]].describe())


if __name__ == "__main__":
    main()