from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from database.db import db
from models.user import User
import re

# ==========================================
# Blueprint
# ==========================================
auth_bp = Blueprint("auth", __name__)

# ==========================================
# Email Validation
# ==========================================
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_valid_email(email):
    return EMAIL_REGEX.match(email) is not None


# ==========================================
# REGISTER
# POST /auth/register
# ==========================================
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No JSON data received."
        }), 400

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    first_name = data.get("first_name", "").strip()
    last_name = data.get("last_name", "").strip()

    # ------------------------------
    # Validate Inputs
    # ------------------------------

    if not first_name or not last_name or not username or not email or not password:
        return jsonify({
        "error": "First name, last name, username, email and password are required."
        }), 400

    if not is_valid_email(email):
        return jsonify({
            "error": "Invalid email address."
        }), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters."
        }), 400

    # ------------------------------
    # Duplicate Checks
    # ------------------------------

    if User.query.filter_by(username=username).first():
        return jsonify({
            "error": "Username already exists."
        }), 409

    if User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Email already exists."
        }), 409

    # ------------------------------
    # Hash Password
    # ------------------------------

    hashed_password = generate_password_hash(password)

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password=hashed_password
    )

    try:

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(
            identity=str(new_user.id)
        )

        return jsonify({

            "message": "Registration successful.",

            "access_token": access_token,

            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }

        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": "Registration failed.",
            "details": str(e)
        }), 500


# ==========================================
# LOGIN
# POST /auth/login
# ==========================================
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No JSON data received."
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    # Find User
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    # Verify Password
    if not check_password_hash(user.password, password):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    # Create JWT Token
    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }
    }), 200


# ==========================================
# CURRENT USER
# GET /auth/me
# ==========================================
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if user is None:
        return jsonify({
            "error": "User not found."
        }), 404

    return jsonify({

        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }

    }), 200


# ==========================================
# TEST ROUTE
# ==========================================
@auth_bp.route("/test")
def test():
    return jsonify({
        "message": "Auth routes working!"
    })