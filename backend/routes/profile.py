from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.user import User

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/save_profile", methods=["POST"])
@jwt_required()
def save_profile():

    user_id = get_jwt_identity()

    data = request.get_json()

    profile = User.query.get(user_id)

    if profile is None:
        return jsonify({
            "error": "User not found"
        }), 404


    profile.age = data["profile"]["age"]
    profile.gender = data["profile"]["gender"]
    profile.height = data["profile"]["height"]
    profile.weight = data["profile"]["weight"]
    profile.goal_weight = data["profile"]["goalWeight"]
    profile.goal = data["profile"]["goal"]
    profile.activity = data["profile"]["activity"]
    profile.workout_days = data["profile"]["workoutDays"]
    profile.workout_type = data["profile"]["workoutType"]
    profile.duration = data["profile"]["duration"]
    profile.diet = data["profile"]["diet"]
    profile.conditions = data["profile"]["conditions"]
    profile.sleep = data["profile"]["sleep"]
    profile.water = data["profile"]["water"]

    profile.plan = data["plan"]

    db.session.commit()

    return jsonify({
        "success": True
    })


@profile_bp.route("/get_profile", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()

    profile = User.query.filter_by(user_id=user_id).first()

    if profile is None:
        return jsonify({
            "exists": False
        })

    return jsonify({
        "exists": True,
        "profile": {
            "age": profile.age,
            "gender": profile.gender,
            "height": profile.height,
            "weight": profile.weight,
            "goalWeight": profile.goal_weight,
            "goal": profile.goal,
            "activity": profile.activity,
            "workoutDays": profile.workout_days,
            "workoutType": profile.workout_type,
            "duration": profile.duration,
            "diet": profile.diet,
            "conditions": profile.conditions,
            "sleep": profile.sleep,
            "water": profile.water
        },
        "plan": profile.plan
    })