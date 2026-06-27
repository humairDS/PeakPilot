from flask import Flask, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import db
from routes.auth import auth_bp
import os
from routes.profile import profile_bp
from routes.ai import ai_bp



# =========================
# APP INITIALIZATION
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "../frontend/templates")
)
CORS(app)

# =========================
# CONFIGURATION
# =========================
app.config['SECRET_KEY']                  = os.environ.get('SECRET_KEY', 'change-me-in-production')
app.config['SQLALCHEMY_DATABASE_URI']     = os.environ.get('DATABASE_URL', 'sqlite:///peakpilot.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY']              = os.environ.get('JWT_SECRET_KEY', 'jwt-change-me-in-production')

# =========================
# EXTENSIONS
# =========================
db.init_app(app)
JWTManager(app)

# =========================
# BLUEPRINT REGISTRATION
# =========================
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(profile_bp)
app.register_blueprint(ai_bp)
# =========================
# ROUTES
# =========================
@app.route("/")
def home():
    return {
    "application": "PeakPilot",
    "status": "running",
    "version": "1.0.0"
}

@app.route("/ui")
def ui():
    return render_template("PeakPilot.html")

# =========================
# CREATE DATABASE TABLES
# =========================
with app.app_context():
    import os

    print("Database URI:", app.config["SQLALCHEMY_DATABASE_URI"])
    print("Current working directory:", os.getcwd())
    db.create_all()

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)
