"""
BMR / TDEE calculation utilities.

Uses the Mifflin-St Jeor equation (the most widely validated BMR formula
in modern sports-nutrition literature) plus standard activity multipliers
to compute Total Daily Energy Expenditure (TDEE).

These functions are used in two places:
1. ml/training/generate_dataset.py - to build realistic synthetic training data
2. ml/recommender.py - as a rule-based fallback if the trained model is unavailable
"""

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "lightly active": 1.375,
    "moderately active": 1.55,
    "very active": 1.725,
    "extremely active": 1.9,
}

GOAL_CALORIE_ADJUSTMENT = {
    "fat loss": -0.20,       # 20% deficit
    "weight loss": -0.20,
    "muscle gain": 0.12,     # 12% surplus
    "bulking": 0.12,
    "maintenance": 0.0,
    "recomposition": -0.05,  # slight deficit
    "endurance": 0.05,
}


def normalize_activity(activity):
    if not activity:
        return "moderately active"
    return str(activity).strip().lower()


def normalize_goal(goal):
    if not goal:
        return "maintenance"
    return str(goal).strip().lower()


def calculate_bmr(weight_kg, height_cm, age, gender):
    """
    Mifflin-St Jeor Equation:
        Men:   BMR = 10*weight + 6.25*height - 5*age + 5
        Women: BMR = 10*weight + 6.25*height - 5*age - 161
    """
    weight_kg = float(weight_kg)
    height_cm = float(height_cm)
    age = float(age)

    base = (10 * weight_kg) + (6.25 * height_cm) - (5 * age)

    gender_norm = (gender or "").strip().lower()

    if gender_norm.startswith("f"):
        return base - 161

    return base + 5


def calculate_tdee(bmr, activity):
    multiplier = ACTIVITY_MULTIPLIERS.get(normalize_activity(activity), 1.55)
    return bmr * multiplier


def calculate_target_calories(tdee, goal):
    adjustment = GOAL_CALORIE_ADJUSTMENT.get(normalize_goal(goal), 0.0)
    return tdee * (1 + adjustment)


def calculate_macros(target_calories, goal):
    """
    Returns a protein/carb/fat split in grams based on standard
    sports-nutrition ratios for the given goal.
    """
    goal_norm = normalize_goal(goal)

    if goal_norm in ("muscle gain", "bulking"):
        protein_pct, carb_pct, fat_pct = 0.30, 0.45, 0.25
    elif goal_norm in ("fat loss", "weight loss", "recomposition"):
        protein_pct, carb_pct, fat_pct = 0.35, 0.35, 0.30
    elif goal_norm == "endurance":
        protein_pct, carb_pct, fat_pct = 0.20, 0.55, 0.25
    else:
        protein_pct, carb_pct, fat_pct = 0.30, 0.40, 0.30

    protein_g = round((target_calories * protein_pct) / 4)
    carb_g = round((target_calories * carb_pct) / 4)
    fat_g = round((target_calories * fat_pct) / 9)

    return {"protein": protein_g, "carbs": carb_g, "fat": fat_g}


def rule_based_recommendation(weight, height, age, gender, activity, goal):
    """
    Full rule-based pipeline, used as a fallback when the trained
    ML model isn't available, and as the ground-truth generator for
    the synthetic training dataset.
    """
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity)
    target_calories = calculate_target_calories(tdee, goal)
    macros = calculate_macros(target_calories, goal)

    return {
        "bmr": round(bmr, 1),
        "tdee": round(tdee, 1),
        "target_calories": round(target_calories),
        **macros,
    }