from flask import Blueprint, jsonify
from database.db import db
from models.user import User
from services.ai_service import generate_plan,regenerate_plan,generate_meal_plan,regenerate_meal_plan
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.plan import Plan
from models.progress import Progress
from models.meal_plan import MealPlan

ai_bp = Blueprint("ai", __name__,url_prefix="/api")

@ai_bp.route("/generate-plan", methods=["POST"])
@jwt_required()
def generate():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
        progress = Progress.query.filter_by(user_id=user.id).all()
        plan = generate_plan(user,progress)

        new_plan = Plan(
            user_id=user.id,
            plan_json=json.dumps(plan)
        )

        db.session.add(new_plan)
        db.session.commit()

        return jsonify(plan)

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 500



@ai_bp.route("/plan", methods=["GET"])
@jwt_required()
def get_plan():
    user_id = get_jwt_identity()

    latest_plan = (
        Plan.query
        .filter_by(user_id=user_id)
        .order_by(Plan.created_at.desc())
        .first()
    )

    if not latest_plan:
        return jsonify({"message":"No plan found"}),404
    
    return jsonify(json.loads(latest_plan.plan_json))


@ai_bp.route("/plans", methods=["GET"])
@jwt_required()
def get_all_plans():
    user_id = get_jwt_identity()

    plans = (
        Plan.query
        .filter_by(user_id=user_id)
        .order_by(Plan.created_at.desc())
        .all()
    )

    return jsonify([
        {
            "id": plan.id,
            "created_at": plan.created_at,
            "plan": json.loads(plan.plan_json)
        }
        for plan in plans
    ])


@ai_bp.route("/regenerate-plan",methods=["POST"])
@jwt_required()
def regenerate():
    
    try:
        user_id = int(get_jwt_identity())

        user = User.query.get_or_404(user_id)

        progress = (
            Progress.query
            .filter_by(user_id=user.id)
            .all()
        )

        plan = regenerate_plan(user, progress)

        new_plan = Plan(
            user_id = user.id,
            plan_json=json.dumps(plan)
        )

        db.session.add(new_plan)
        db.session.commit()

        return jsonify(plan)

        # We'll save the new plan next

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    

@ai_bp.route("/generate-meal-plan", methods=["POST"])
@jwt_required()
def generate_meal():

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    meal_plan = generate_meal_plan(user)

    new_meal_plan = MealPlan(
        user_id=user.id,
        meal_json=json.dumps(meal_plan)
    )

    db.session.add(new_meal_plan)
    db.session.commit()

    return jsonify(meal_plan)



@ai_bp.route("/regenerate-meal-plan", methods=["POST"])
@jwt_required()
def regenerate_meal():

    try:

        user_id = int(get_jwt_identity())

        user = User.query.get_or_404(user_id)

        progress = (
            Progress.query
            .filter_by(user_id=user.id)
            .all()
        )

        meal_plan = regenerate_meal_plan(user, progress)

        new_meal = MealPlan(
            user_id=user.id,
            meal_json=json.dumps(meal_plan)
        )

        db.session.add(new_meal)
        db.session.commit()

        return jsonify(meal_plan)

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500