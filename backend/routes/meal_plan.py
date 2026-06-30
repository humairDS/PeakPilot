from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.meal_plan import MealPlan
import json

meal_plan_bp = Blueprint("meal_plan", __name__)


@meal_plan_bp.route("/meal-plans", methods=["GET"])
@jwt_required()
def get_meal_plans():

    user_id = int(get_jwt_identity())

    meal_plans = (
        MealPlan.query
        .filter_by(user_id=user_id)
        .order_by(MealPlan.created_at.desc())
        .all()
    )

    result = []

    for meal in meal_plans:
        result.append({
            "id": meal.id,
            "created_at": meal.created_at.strftime("%Y-%m-%d %H:%M"),
            "meal_plan": json.loads(meal.meal_json)
        })

    return jsonify(result)