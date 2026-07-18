from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.user import User
from ml.recommender import get_recommendation
from ml.accuracy import get_model_metrics

ml_bp = Blueprint("ml", __name__, url_prefix="/ml")


@ml_bp.route("/recommendation", methods=["GET"])
@jwt_required()
def recommendation():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    profile = {
        "age": user.age,
        "gender": user.gender,
        "height": user.height,
        "weight": user.weight,
        "goal_weight": user.goal_weight,
        "goal": user.goal,
        "activity": user.activity,
        "workout_days": user.workout_days,
        "sleep": user.sleep,
        "water": user.water,
    }

    result = get_recommendation(profile)

    status_code = 200 if result.get("success") else 400

    return jsonify(result), status_code


@ml_bp.route("/accuracy", methods=["GET"])
def accuracy():
    return jsonify(get_model_metrics())