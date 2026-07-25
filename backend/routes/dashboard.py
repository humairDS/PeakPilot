from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

from models.user import User
from models.plan import Plan
from models.progress import Progress
from models.meal_plan import MealPlan

from datetime import datetime, timedelta

dashboard_bp = Blueprint("dashboard", __name__)


def build_greeting(first_name):
    hour = datetime.utcnow().hour

    if hour < 12:
        time_of_day = "Good morning"
    elif hour < 18:
        time_of_day = "Good afternoon"
    else:
        time_of_day = "Good evening"

    name = first_name or "Athlete"

    return f"{time_of_day}, {name} \U0001F44B"


@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    latest_plan = (
        Plan.query
        .filter_by(user_id=user_id)
        .order_by(Plan.created_at.desc())
        .first()
    )

    latest_progress = (
        Progress.query
        .filter_by(user_id=user_id)
        .order_by(Progress.created_at.desc())
        .first()
    )

    all_progress = (
        Progress.query
        .filter_by(user_id=user_id)
        .order_by(Progress.created_at.desc())
        .all()
    )

    current_streak = 0
    expected_date = None

    for progress in all_progress:

        progress_date = progress.created_at.date()

        if not progress.workout_completed:
            break

        if expected_date is None:

            current_streak = 1
            expected_date = progress_date - timedelta(days=1)

        elif progress_date == expected_date:

            current_streak += 1
            expected_date = progress_date - timedelta(days=1)

        else:
            break

    week_start = datetime.utcnow() - timedelta(days=7)

    weekly_progress = (
        Progress.query
        .filter(
            Progress.user_id == user_id,
            Progress.created_at >= week_start
        )
        .order_by(Progress.created_at.asc())
        .all()
    )

    weekly_workouts = sum(
        1
        for p in weekly_progress
        if p.workout_completed
    )

    average_sleep = 0

    if weekly_progress:
        sleep_entries = [p.sleep for p in weekly_progress if p.sleep is not None]
        if sleep_entries:
            average_sleep = round(sum(sleep_entries) / len(sleep_entries), 1)

    average_water = 0

    if weekly_progress:
        water_entries = [p.water for p in weekly_progress if p.water is not None]
        if water_entries:
            average_water = round(sum(water_entries) / len(water_entries), 1)

    average_energy = 0

    if weekly_progress:
        energy_entries = [p.energy for p in weekly_progress if p.energy is not None]
        if energy_entries:
            average_energy = round(sum(energy_entries) / len(energy_entries))

    weekly_weight_change = 0

    if len(weekly_progress) >= 2:

        oldest = weekly_progress[0]
        newest = weekly_progress[-1]

        weekly_weight_change = round(
            newest.weight - oldest.weight,
            1
        )

    plans_generated = Plan.query.filter_by(user_id=user_id).count()

    progress_entries = Progress.query.filter_by(user_id=user_id).count()

    completed_workouts = (
        Progress.query
        .filter_by(
            user_id=user_id,
            workout_completed=True
        )
        .count()
    )

    first_progress = (
        Progress.query
        .filter_by(user_id=user_id)
        .order_by(Progress.created_at.asc())
        .first()
    )

    current_weight = (
        latest_progress.weight
        if latest_progress
        else user.weight
    )

    goal_weight = user.goal_weight

    weight_remaining = None
    weight_change = None
    completion_rate = 0
    goal_progress = 0

    if progress_entries > 0:
        completion_rate = round(
            (completed_workouts / progress_entries) * 100,
            1
        )

    if first_progress and latest_progress:
        weight_change = latest_progress.weight - first_progress.weight

    if current_weight is not None and goal_weight is not None:
        weight_remaining = abs(current_weight - goal_weight)

    if (
        user.weight is not None and
        goal_weight is not None and
        current_weight is not None
    ):

        total_journey = abs(user.weight - goal_weight)
        completed_journey = abs(user.weight - current_weight)

        if total_journey > 0:
            goal_progress = round(
                (completed_journey / total_journey) * 100,
                1
            )

            goal_progress = min(goal_progress, 100)

    achievements = []

    if completed_workouts >= 1:
        achievements.append({
            "title": "First Workout",
            "description": "Completed your first workout.",
            "earned": True
        })
    else:
        achievements.append({
            "title": "First Workout",
            "description": "Complete your first workout.",
            "earned": False
        })

    if current_streak >= 7:
        achievements.append({
            "title": "7-Day Streak",
            "description": "Worked out for 7 consecutive days.",
            "earned": True
        })
    else:
        achievements.append({
            "title": "7-Day Streak",
            "description": "Reach a 7-day workout streak.",
            "earned": False
        })

    if completed_workouts >= 10:
        achievements.append({
            "title": "10 Workouts",
            "description": "Completed 10 workouts.",
            "earned": True
        })
    else:
        achievements.append({
            "title": "10 Workouts",
            "description": "Complete 10 workouts.",
            "earned": False
        })

    if weight_change is not None and weight_change <= -5:
        achievements.append({
            "title": "Lost 5 kg",
            "description": "Lost at least 5 kg.",
            "earned": True
        })
    else:
        achievements.append({
            "title": "Lost 5 kg",
            "description": "Lose 5 kg from your starting weight.",
            "earned": False
        })

    latest_meal = (
        MealPlan.query
        .filter_by(user_id=user_id)
        .order_by(MealPlan.created_at.desc())
        .first()
    )

    return jsonify({
        "greeting": build_greeting(user.first_name),

        "profile": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "age": user.age,
            "gender": user.gender,
            "height": user.height,
            "weight": user.weight,
            "goal_weight": user.goal_weight,
            "goal": user.goal,
            "activity": user.activity,
            "workout_days": user.workout_days,
            "workout_type": user.workout_type,
            "duration": user.duration,
            "diet": user.diet,
            "conditions": user.conditions,
            "sleep": user.sleep,
            "water": user.water
        },

        "latest_plan": (
            json.loads(latest_plan.plan_json)
            if latest_plan
            else None
        ),

        "latest_progress": (
            {
                "weight": latest_progress.weight,
                "body_fat": latest_progress.body_fat,
                "sleep": latest_progress.sleep,
                "water": latest_progress.water,
                "energy": latest_progress.energy,
                "workout_completed": latest_progress.workout_completed,
                "notes": latest_progress.notes,
                "created_at": latest_progress.created_at.isoformat() + "Z"
            }
            if latest_progress
            else None
        ),

        "weekly_summary": {
            "workouts_completed": weekly_workouts,
            "average_sleep": average_sleep,
            "average_water": average_water,
            "average_energy": average_energy,
            "weight_change": weekly_weight_change
        },

        "achievements": achievements,

        "statistics": {
            "plans_generated": plans_generated,
            "progress_entries": progress_entries,
            "current_weight": current_weight,
            "goal_weight": goal_weight,
            "weight_remaining": weight_remaining,
            "weight_change": weight_change,
            "completed_workouts": completed_workouts,
            "completion_rate": completion_rate,
            "current_streak": current_streak,
            "goal_progress": goal_progress
        },

        "latest_meal": (
            json.loads(latest_meal.meal_json)
            if latest_meal
            else []
        ),
    })
