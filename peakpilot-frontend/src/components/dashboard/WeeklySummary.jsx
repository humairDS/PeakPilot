function WeeklySummary({ weekly }) {
  if (!weekly) return null;

  return (
    <div className="grid-4 mb-2">
      <div className="card">
        <div style={{ color: "#1d9e75", fontSize: "14px", marginBottom: "10px" }}>
          Workouts Completed
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: "700" }}>
          {weekly.workouts_completed ?? 0}
        </h2>
      </div>

      <div className="card">
        <div style={{ color: "#534ab7", fontSize: "14px", marginBottom: "10px" }}>
          Avg Sleep
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: "700" }}>
          {weekly.average_sleep ?? 0} hrs
        </h2>
      </div>

      <div className="card">
        <div style={{ color: "#378add", fontSize: "14px", marginBottom: "10px" }}>
          Avg Water
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: "700" }}>
          {weekly.average_water ?? 0} L
        </h2>
      </div>

      <div className="card">
        <div style={{ color: "#e24b4a", fontSize: "14px", marginBottom: "10px" }}>
          Avg Energy
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: "700" }}>
          {weekly.average_energy ?? 0}/10
        </h2>
      </div>
    </div>
  );
}

export default WeeklySummary;