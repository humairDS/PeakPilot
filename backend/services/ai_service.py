import json
import os
from dotenv import load_dotenv
from google import genai

load_dotenv(".env")   # or just load_dotenv() if your .env is in the root

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_plan(user):
    prompt = f"""
    You are an expert certified fitness coach and personal trainer.

    Create a personalized workout plan for the following user.

    User Information:
    - Age: {user.age}
    - Gender: {user.gender}
    - Height: {user.height} cm
    - Weight: {user.weight} kg
    - Goal Weight: {user.goal_weight} kg
    - Fitness Goal: {user.goal}
    - Activity Level: {user.activity}
    - Workout Days Per Week: {user.workout_days}
    - Preferred Workout Type: {user.workout_type}
    - Workout Duration: {user.duration} minutes
    - Diet Preference: {user.diet}
    - Medical Conditions: {user.conditions}
    - Average Sleep: {user.sleep} hours
    - Daily Water Intake: {user.water} liters

    Requirements:
    - Create exactly {user.workout_days} workout days.
    - Match the user's fitness goal.
    - Match the preferred workout type.
    - Each workout should fit within {user.duration} minutes.
    - Include warm-up and cool-down.
    - Include sets, reps and rest time.
    - Avoid exercises that may be unsafe based on medical conditions.
    - Progressively vary the workouts throughout the week.
    - Add one nutrition tip for each day.

    Return ONLY valid JSON.

    Use this format:

    {{
      "workout": [
        {{
          "day": "Monday",
          "focus": "Chest & Triceps",
          "warmup": [
            "5 minutes brisk walk"
          ],
          "exercises": [
            {{
              "name": "Bench Press",
              "sets": 4,
              "reps": "8-10",
              "rest": "90 seconds"
            }}
          ],
          "cooldown": [
            "Chest Stretch"
          ],
          "nutrition_tip": "Eat lean protein after training."
        }}
      ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "top_p": 0.9,
            "top_k": 20,
            "max_output_tokens": 4096,
        }
    )

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {
            "error": "AI returned invalid JSON",
            "raw": response.text
        }