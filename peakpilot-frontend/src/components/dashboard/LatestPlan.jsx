function LatestPlan({ plan }) {
  if (!plan || !plan.workout || plan.workout.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-4 text-xl font-bold">Latest Workout Plan</h3>
        <p>No plan found yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-xl font-bold">Latest Workout Plan</h3>

      <div className="space-y-4">
        {plan.workout.slice(0, 3).map((dayPlan, index) => (
          <div key={index} className="border-b pb-3">
            <p><strong>{dayPlan.day}</strong> — {dayPlan.focus}</p>
            <p>{dayPlan.exercises?.length || 0} exercises</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestPlan;