import json
import os
from dotenv import load_dotenv, find_dotenv
from google import genai
from models.progress import Progress

load_dotenv(find_dotenv(usecwd=False))   # searches upward from this file's own location (backend/services -> backend -> project root), regardless of where the app is launched from

_client = None

def get_client():
    """Lazily creates the Gemini client on first actual use, rather than at
    import time — this keeps server startup/cold-start fast, since this
    module gets re-imported every time a sleeping free-tier instance wakes up."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _client

def generate_plan(user,progress):
    progress_text = ""

    for p in progress:
        progress_text += f"""
        Date: {p.created_at.strftime("%Y-%m-%d")}
        Weight: {p.weight} kg
        Body Fat: {p.body_fat}%
        Sleep: {p.sleep} hours
        Water: {p.water} L
        Energy: {p.energy}/10
        Workout Completed: {p.workout_completed}
        Notes: {p.notes}
    """

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
    - Available Equipment: {user.equipment or "not specified — assume bodyweight only"}
    - Diet Preference: {user.diet}
    - Medical Conditions: {user.conditions}
    - Average Sleep: {user.sleep} hours
    - Daily Water Intake: {user.water} liters

    Requirements:
    - Create exactly {user.workout_days} workout days.
    - Match the user's fitness goal.
    - Match the preferred workout type.
    - Only include exercises that can be performed with the user's available equipment.
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

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "max_output_tokens": 8192,
        }
    )

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {
            "error": "AI returned invalid JSON",
            "raw": response.text
        }
    


def regenerate_plan(user, progress):
    progress_text = ""

    for p in progress:
        progress_text += f"""
        Date: {p.created_at.strftime("%Y-%m-%d")}
        Weight: {p.weight} kg
        Body Fat: {p.body_fat}%
        Sleep: {p.sleep} hours
        Water: {p.water} L
        Energy: {p.energy}/10
        Workout Completed: {p.workout_completed}
        Notes: {p.notes}
        """

    prompt = f"""
    You are an expert certified fitness coach and personal trainer.

    The user has already been following a workout plan.

    Analyze the user's recent progress and generate an UPDATED workout plan.

    User Information:
    - Age: {user.age}
    - Gender: {user.gender}
    - Height: {user.height} cm
    - Current Weight: {user.weight} kg
    - Goal Weight: {user.goal_weight} kg
    - Fitness Goal: {user.goal}
    - Activity Level: {user.activity}
    - Workout Days Per Week: {user.workout_days}
    - Preferred Workout Type: {user.workout_type}
    - Workout Duration: {user.duration} minutes
    - Available Equipment: {user.equipment or "not specified — assume bodyweight only"}
    - Diet Preference: {user.diet}
    - Medical Conditions: {user.conditions}

    Recent Progress History:
    {progress_text}

    Instructions:
    - Analyze the user's progress history before creating the plan.
    - If workouts are completed consistently, slightly increase training intensity.
    - If workouts are frequently missed, reduce intensity and improve adherence.
    - Consider sleep quality and energy levels.
    - Consider hydration habits.
    - Consider weight changes.
    - Keep the same fitness goal unless progress clearly suggests adjustments.
    - Keep workouts within {user.duration} minutes.
    - Only include exercises that can be performed with the user's available equipment.
    - Create exactly {user.workout_days} workout days.
    - Include warm-up and cool-down.
    - Include sets, reps and rest time.
    - Add one nutrition tip for each day.
    - Return ONLY valid JSON.

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

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "max_output_tokens": 8192,
        }
    )

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {
            "error": "AI returned invalid JSON",
            "raw": response.text
        }
    
def generate_meal_plan(user):

    prompt = f"""
    You are an expert certified nutritionist.

    Create a personalized daily meal plan for the following user.

    User Information:
    - Age: {user.age}
    - Gender: {user.gender}
    - Height: {user.height} cm
    - Weight: {user.weight} kg
    - Goal Weight: {user.goal_weight} kg
    - Fitness Goal: {user.goal}
    - Activity Level: {user.activity}
    - Diet Preference: {user.diet}
    - Medical Conditions: {user.conditions}

    Requirements:
    - Calculate an appropriate daily calorie intake.
    - Include Breakfast.
    - Include Lunch.
    - Include Dinner.
    - Include 2 Healthy Snacks.
    - Show estimated calories for each meal.
    - Include protein, carbohydrates and healthy fats.
    - Avoid foods that conflict with medical conditions.
    - Match the user's fitness goal.

    Return ONLY valid JSON.

    Use this format:

    {{
      "daily_calories": 2200,
      "protein": "160g",
      "carbs": "220g",
      "fat": "60g",

      "meal_plan":[

        {{
          "meal":"Breakfast",
          "foods":[
            "3 Eggs",
            "2 Whole Wheat Toast",
            "1 Banana"
          ],
          "calories":550
        }}

      ]
    }}
    """

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "max_output_tokens": 16000,
        }
    )

    try:
        return json.loads(response.text)

    except json.JSONDecodeError:
        return {
            "error": "AI returned invalid JSON",
            "raw": response.text
        }
    
def regenerate_meal_plan(user, progress):

    progress_text = ""

    for p in progress:
        progress_text += f"""
        Date: {p.created_at.strftime("%Y-%m-%d")}
        Weight: {p.weight} kg
        Body Fat: {p.body_fat}%
        Sleep: {p.sleep} hours
        Water: {p.water} L
        Energy: {p.energy}/10
        Workout Completed: {p.workout_completed}
        Notes: {p.notes}
        """

    prompt = f"""
    You are an expert certified nutritionist.

    The user has been following a meal plan.

    Analyze the user's recent progress and generate an UPDATED meal plan.

    User Information:
    - Age: {user.age}
    - Gender: {user.gender}
    - Height: {user.height} cm
    - Current Weight: {user.weight} kg
    - Goal Weight: {user.goal_weight} kg
    - Fitness Goal: {user.goal}
    - Activity Level: {user.activity}
    - Diet Preference: {user.diet}
    - Medical Conditions: {user.conditions}

    Recent Progress:
    {progress_text}

    Instructions:
    - Analyze the user's progress history.
    - Adjust calories if necessary.
    - Adjust protein intake if needed.
    - Recommend healthier food choices based on progress.
    - Consider workout consistency.
    - Consider sleep quality.
    - Consider hydration.
    - Match the user's fitness goal.
    - Include Breakfast.
    - Include Lunch.
    - Include Dinner.
    - Return ONLY valid JSON.

    Use this format:

    {{
      "daily_calories": 2200,
      "protein": "160g",
      "carbs": "220g",
      "fat": "60g",
      "meal_plan": [
        {{
          "meal": "Breakfast",
          "foods": [
            "3 Eggs",
            "2 Whole Wheat Toast"
          ],
          "calories": 500
        }}
      ]
    }}
    """

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "max_output_tokens": 16000,
        }
    )

    try:
        return json.loads(response.text)

    except json.JSONDecodeError:
        return {{
            "error": "AI returned invalid JSON",
            "raw": response.text
        }}
