function WorkoutDayCard({ dayPlan }) {
  return (
    <div className="card mb-4">
      <h3 className="text-xl font-bold mb-2">
        {dayPlan.day} — {dayPlan.focus}
      </h3>

      <div className="space-y-2">
        {dayPlan.exercises?.map((exercise, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            <p className="font-semibold">{exercise.name}</p>
            <p className="text-sm opacity-80">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutDayCard;