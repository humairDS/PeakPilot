from database.db import db
from datetime import datetime

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    username = db.Column(db.String(100), unique=True, nullable=True)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))

    height = db.Column(db.Float)
    weight = db.Column(db.Float)
    goal_weight = db.Column(db.Float)

    goal = db.Column(db.String(50))
    activity = db.Column(db.String(50))

    workout_days = db.Column(db.Integer)
    workout_type = db.Column(db.String(50))
    duration = db.Column(db.Integer)

    diet = db.Column(db.String(100))
    conditions = db.Column(db.Text)

    sleep = db.Column(db.Float)
    water = db.Column(db.Float)

    # Stores the generated AI plan as JSON text
    plan = db.Column(db.Text)


