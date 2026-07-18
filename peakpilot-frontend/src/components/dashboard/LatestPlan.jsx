function LatestPlan({ plan }) {
  if (!plan || !plan.workout || plan.workout.length === 0) {
    return (
      <div className="card" style={{ padding: "24px", borderRadius: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px", fontWeight: "800" }}>
          Latest Workout Plan
        </h3>
        <p style={{ opacity: 0.75, margin: 0 }}>No workout plan found yet.</p>
      </div>
    );
  }

  const totalDays = plan.workout.length;
  const totalExercises = plan.workout.reduce(
    (sum, day) => sum + (day.exercises?.length || 0),
    0
  );

  return (
    <div className="card" style={{ padding: "24px", borderRadius: "20px" }}>
      <div style={{ marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>
          Latest Workout Plan
        </h3>
        <p style={{ margin: "6px 0 0 0", opacity: 0.75, fontSize: "14px" }}>
          A quick preview of your current workout split.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        <div
          style={{
            background: "var(--surface2)",
            borderRadius: "14px",
            padding: "14px",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: "700",
              color: "#534ab7"
            }}
          >
            Workout Days
          </p>
          <h4 style={{ margin: "8px 0 0 0", fontSize: "22px", fontWeight: "800" }}>
            {totalDays}
          </h4>
        </div>

        <div
          style={{
            background: "var(--surface2)",
            borderRadius: "14px",
            padding: "14px",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: "700",
              color: "#1d9e75"
            }}
          >
            Total Exercises
          </p>
          <h4 style={{ margin: "8px 0 0 0", fontSize: "22px", fontWeight: "800" }}>
            {totalExercises}
          </h4>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {plan.workout.slice(0, 3).map((dayPlan, index) => (
          <div
            key={index}
            style={{
              background: "var(--surface2)",
              borderRadius: "14px",
              padding: "14px",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p style={{ margin: 0, fontWeight: "800", fontSize: "16px" }}>
                  {dayPlan.day}
                </p>
                <p style={{ margin: "4px 0 0 0", opacity: 0.8 }}>
                  {dayPlan.focus}
                </p>
              </div>

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#378add",
                  whiteSpace: "nowrap"
                }}
              >
                {dayPlan.exercises?.length || 0} exercises
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestPlan;