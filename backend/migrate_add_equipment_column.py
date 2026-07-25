"""
One-time migration: adds the new 'equipment' column to the existing
'users' table.

Why this is needed: db.create_all() only creates tables that don't exist
yet — it does NOT add new columns to a table that's already there. Since
your database (local SQLite or Render's Postgres) already has a 'users'
table from before this change, we need to explicitly ALTER it once.

This script reuses your actual Flask app's database connection (same as
running app.py), so it always targets the real database file/URL your
app uses — including Flask's default of storing local SQLite files in an
instance/ subfolder, which a hand-built path can easily miss.

Safe to run: this only ADDS a column (nullable), so no existing rows or
data are touched or lost. Safe to run more than once — it checks first.

Usage (run once, from the backend/ directory, with your venv activated):
    python migrate_add_equipment_column.py

For your deployed Render backend: open the "Shell" tab on your Render
web service dashboard and run the same command there, so it runs against
your actual production database.
"""

from sqlalchemy import text, inspect
from app import app
from database.db import db

with app.app_context():
    inspector = inspect(db.engine)
    existing_columns = [col["name"] for col in inspector.get_columns("users")]

    if "equipment" in existing_columns:
        print("Column 'equipment' already exists on 'users' — nothing to do.")
    else:
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN equipment VARCHAR(50)"))
            conn.commit()
        print("Added 'equipment' column to 'users' table successfully.")
