function LatestProgress({ progress }) {
  if (!progress) {
    return (
      <div className="card" style={{ padding: "24px", borderRadius: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px", fontWeight: "800" }}>
          Latest Progress
        </h3>
        <p style={{ opacity: 0.75, margin: 0 }}>No progress data yet.</p>
      </div>
    );
  }

  const items = [
    { label: "Weight", value: `${progress.weight ?? "-"} kg`, color: "#1d9e75" },
    { label: "Body Fat", value: `${progress.body_fat ?? "-"}%`, color: "#534ab7" },
    { label: "Sleep", value: `${progress.sleep ?? "-"} hrs`, color: "#378add" },
    { label: "Water", value: `${progress.water ?? "-"} L`, color: "#16a085" },
    { label: "Energy", value: `${progress.energy ?? "-"} / 10`, color: "#e24b4a" },
    {
      label: "Workout",
      value: progress.workout_completed ? "Completed" : "Missed",
      color: progress.workout_completed ? "#1d9e75" : "#e24b4a"
    }
  ];

  return (
    <div className="card" style={{ padding: "24px", borderRadius: "20px" }}>
      <div style={{ marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>
          Latest Progress
        </h3>
        <p style={{ margin: "6px 0 0 0", opacity: 0.75, fontSize: "14px" }}>
          Logged on {progress.created_at ?? "-"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px"
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
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
                color: item.color,
                opacity: 0.95
              }}
            >
              {item.label}
            </p>
            <h4
              style={{
                margin: "8px 0 0 0",
                fontSize: "20px",
                fontWeight: "800"
              }}
            >
              {item.value}
            </h4>
          </div>
        ))}
      </div>

      {progress.notes && (
        <div
          style={{
            marginTop: "16px",
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
              color: "#c9a227"
            }}
          >
            Notes
          </p>
          <p style={{ margin: "8px 0 0 0", opacity: 0.85, lineHeight: 1.5 }}>
            {progress.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export default LatestProgress;