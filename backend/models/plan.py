from database.db import db
from datetime import datetime

class Plan(db.Model):

    __tablename__ = "plans"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    plan_json = db.Column(db.Text, nullable=False)