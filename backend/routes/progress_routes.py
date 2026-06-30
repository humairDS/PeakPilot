from flask import Blueprint, request, jsonify
from database.db import db
from models.user import User
import json
from models.progress import Progress
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import datetime 
from utils.validatores import validate_profile

progress_bp = Blueprint("progress", __name__)


# Add Progress
@progress_bp.route("/progress", methods=["POST"])
@jwt_required()
def add_progress():

    data = request.json

    error = validate_profile(data.get("weight"))

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400
    
    user_id = int(get_jwt_identity())

    today = datetime.utcnow().date()

    existing_progress = (
        Progress.query
        .filter_by(user_id=user_id)
        .all()
    )

    today_progress = None

    for p in existing_progress:
        if p.created_at.date() == today:
            today_progress = p
            break

    if today_progress:

            today_progress.weight = data.get("weight")
            today_progress.body_fat = data.get("body_fat")
            today_progress.sleep = data.get("sleep")
            today_progress.water = data.get("water")
            today_progress.energy = data.get("energy")
            today_progress.workout_completed = data.get("workout_completed", False)
            today_progress.notes = data.get("notes")

    else:

            progress = Progress(
                user_id=user_id,
                weight=data.get("weight"),
                body_fat=data.get("body_fat"),
                sleep=data.get("sleep"),
                water=data.get("water"),
                energy=data.get("energy"),
                workout_completed=data.get("workout_completed", False),
                notes=data.get("notes")
            )

            db.session.add(progress)

    db.session.commit()

    return jsonify({
        "message": "Progress added successfully"
    })


# Get Progress
@progress_bp.route("/progress", methods=["GET"])
@jwt_required()
def get_progress():
    
    user_id =int(get_jwt_identity())

    progress = Progress.query.filter_by(user_id=user_id).all()

    result = []

    for p in progress:
        result.append({
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M"),
            "weight": p.weight,
            "body_fat": p.body_fat,
            "sleep": p.sleep,
            "water": p.water,
            "energy": p.energy,
            "workout_completed": p.workout_completed,
            "notes": p.notes
        })
    return jsonify(result)