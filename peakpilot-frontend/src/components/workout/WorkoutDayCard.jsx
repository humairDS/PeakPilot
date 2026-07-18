function WorkoutDayCard({ dayPlan }) {
  const exercises = Array.isArray(dayPlan?.exercises) ? dayPlan.exercises : [];
  const warmup = Array.isArray(dayPlan?.warmup) ? dayPlan.warmup : [];
  const cooldown = Array.isArray(dayPlan?.cooldown) ? dayPlan.cooldown : [];

  return (
    <div className="workout-card mb-3">
      <div className="panel-body">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">{dayPlan?.day || "Training Day"}</h3>
            <p className="panel-subtitle">{dayPlan?.focus || "General session"}</p>
          </div>
          <div className="badge badge-brand">{exercises.length} exercises</div>
        </div>

        {warmup.length > 0 && (
          <div className="mb-3">
            <p className="sub-heading">Warm-up</p>
            <ul className="plain-list">
              {warmup.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {exercises.length > 0 && (
          <div className="mb-3">
            <p className="sub-heading">Exercises</p>
            {exercises.map((exercise, i) => (
              <div key={i} className="exercise-item">
                <p className="exercise-name">{exercise.name || `Exercise ${i + 1}`}</p>
                <div className="exercise-meta">
                  {exercise.sets && (
                    <span className="exercise-meta-chip">{exercise.sets} sets</span>
                  )}
                  {exercise.reps && (
                    <span className="exercise-meta-chip">{exercise.reps} reps</span>
                  )}
                  {exercise.rest && (
                    <span className="exercise-meta-chip">{exercise.rest} rest</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {cooldown.length > 0 && (
          <div className="mb-2">
            <p className="sub-heading">Cool-down</p>
            <ul className="plain-list">
              {cooldown.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {dayPlan?.nutrition_tip && (
          <div className="inline-alert success" style={{ marginTop: "16px", marginBottom: 0 }}>
            💡 {dayPlan.nutrition_tip}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutDayCard;
