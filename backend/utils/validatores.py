def validate_weight(weight):
    if weight is None:
        return "Weight is required."

    if not isinstance(weight, (int, float)):
        return "Weight must be a number."

    if weight < 20 or weight > 400:
        return "Weight must be between 20 and 400 kg."

    return None


def validate_goal_weight(weight):
    if weight is None:
        return "Goal weight is required."

    if not isinstance(weight, (int, float)):
        return "Goal weight must be a number."

    if weight < 20 or weight > 400:
        return "Goal weight must be between 20 and 400 kg."

    return None


def validate_height(height):
    if height is None:
        return "Height is required."

    if not isinstance(height, (int, float)):
        return "Height must be a number."

    if height < 100 or height > 250:
        return "Height must be between 100 and 250 cm."

    return None


def validate_age(age):
    if age is None:
        return "Age is required."

    if not isinstance(age, int):
        return "Age must be an integer."

    if age < 10 or age > 100:
        return "Age must be between 10 and 100."

    return None


def validate_sleep(hours):
    if hours is None:
        return "Sleep is required."

    if not isinstance(hours, (int, float)):
        return "Sleep must be a number."

    if hours < 0 or hours > 24:
        return "Sleep must be between 0 and 24 hours."

    return None


def validate_water(water):
    if water is None:
        return "Water intake is required."

    if not isinstance(water, (int, float)):
        return "Water must be a number."

    if water < 0 or water > 10:
        return "Water must be between 0 and 10 liters."

    return None


def validate_energy(energy):
    if energy is None:
        return "Energy is required."

    if not isinstance(energy, int):
        return "Energy must be an integer."

    if energy < 1 or energy > 10:
        return "Energy must be between 1 and 10."

    return None


def validate_body_fat(body_fat):
    if body_fat is None:
        return None

    if not isinstance(body_fat, (int, float)):
        return "Body fat must be a number."

    if body_fat < 0 or body_fat > 70:
        return "Body fat must be between 0 and 70%."

    return None


def validate_workout_days(days):
    if days is None:
        return "Workout days are required."

    if not isinstance(days, int):
        return "Workout days must be an integer."

    if days < 1 or days > 7:
        return "Workout days must be between 1 and 7."

    return None


def validate_duration(duration):
    if duration is None:
        return "Workout duration is required."

    if not isinstance(duration, int):
        return "Workout duration must be an integer."

    if duration < 15 or duration > 180:
        return "Workout duration must be between 15 and 180 minutes."

    return None


def validate_profile(profile):

    validators = [
        validate_age(profile.get("age")),
        validate_height(profile.get("height")),
        validate_weight(profile.get("weight")),
        validate_goal_weight(profile.get("goalWeight")),
        validate_sleep(profile.get("sleep")),
        validate_water(profile.get("water")),
        validate_workout_days(profile.get("workoutDays")),
        validate_duration(profile.get("duration")),
    ]

    for error in validators:
        if error:
            return error

    return None