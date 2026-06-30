from database.db import db
from datetime import datetime


class Progress(db.Model):
    __tablename__ = "progress"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    weight = db.Column(db.Float)

    body_fat = db.Column(db.Float)

    sleep = db.Column(db.Float)

    water = db.Column(db.Float)

    energy = db.Column(db.Integer)

    workout_completed = db.Column(db.Boolean, default=False)

    notes = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )
    