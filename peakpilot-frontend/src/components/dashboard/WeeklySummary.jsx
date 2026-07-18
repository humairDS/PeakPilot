function WeeklySummary({ weekly }) {
  if (!weekly) return null;

  const items = [
    {
      title: "Workouts Completed",
      value: weekly.workouts_completed ?? 0,
      suffix: "",
      color: "#1d9e75"
    },
    {
      title: "Average Sleep",
      value: weekly.average_sleep ?? 0,
      suffix: " hrs",
      color: "#534ab7"
    },
    {
      title: "Average Water",
      value: weekly.average_water ?? 0,
      suffix: " L",
      color: "#378add"
    },
    {
      title: "Average Energy",
      value: weekly.average_energy ?? 0,
      suffix: "/10",
      color: "#e24b4a"
    }
  ];

  return (
    <div className="card mb-2" style={{ padding: "24px", borderRadius: "20px" }}>
      <div style={{ marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>
          Weekly Summary
        </h3>
        <p style={{ margin: "6px 0 0 0", opacity: 0.75, fontSize: "14px" }}>
          Your performance and recovery trends over the last 7 days.
        </p>
      </div>

      <div className="grid-4">
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background: "var(--surface2)",
              borderRadius: "16px",
              padding: "18px",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <p
              style={{
                margin: 0,
                color: item.color,
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              {item.title}
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "800",
                lineHeight: 1.1
              }}
            >
              {item.value}
              <span style={{ fontSize: "16px", opacity: 0.75 }}>
                {item.suffix}
              </span>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklySummary;