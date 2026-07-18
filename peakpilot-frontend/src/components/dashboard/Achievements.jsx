function Achievements({ achievements }) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="card" style={{ padding: "24px", borderRadius: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px", fontWeight: "800" }}>
          Achievements
        </h3>
        <p style={{ opacity: 0.75, margin: 0 }}>No achievements yet.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "24px", borderRadius: "20px" }}>
      <div style={{ marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>
          Achievements
        </h3>
        <p style={{ margin: "6px 0 0 0", opacity: 0.75, fontSize: "14px" }}>
          Milestones you’ve unlocked on your fitness journey.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "14px"
        }}
      >
        {achievements.map((achievement, index) => {
          const title =
            typeof achievement === "string"
              ? achievement
              : achievement.title || achievement.name || "Achievement";

          const description =
            typeof achievement === "string" ? "" : achievement.description || "";

          const earned =
            typeof achievement === "string" ? true : !!achievement.earned;

          return (
            <div
              key={index}
              style={{
                borderRadius: "16px",
                padding: "16px",
                background: earned
                  ? "linear-gradient(135deg, rgba(29,158,117,0.14), rgba(29,158,117,0.06))"
                  : "var(--surface2)",
                border: earned
                  ? "1px solid rgba(29,158,117,0.35)"
                  : "1px solid rgba(255,255,255,0.06)",
                opacity: earned ? 1 : 0.88
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px"
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "800"
                    }}
                  >
                    {title}
                  </p>

                  {description && (
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "14px",
                        opacity: 0.78,
                        lineHeight: 1.5
                      }}
                    >
                      {description}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    minWidth: "70px",
                    textAlign: "center",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "800",
                    background: earned ? "rgba(29,158,117,0.18)" : "rgba(255,255,255,0.06)",
                    color: earned ? "#1d9e75" : "rgba(255,255,255,0.7)"
                  }}
                >
                  {earned ? "Earned" : "Locked"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;