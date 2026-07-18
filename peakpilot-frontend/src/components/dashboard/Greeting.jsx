function Greeting({ name }) {
  const hour = new Date().getHours();

  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <div
      className="card mb-2"
      style={{
        padding: "28px",
        borderRadius: "20px",
        background:
          "linear-gradient(135deg, rgba(29,158,117,0.15), rgba(83,74,183,0.12))",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.7
          }}
        >
          PeakPilot Dashboard
        </span>

        <h1
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: "800",
            lineHeight: 1.15
          }}
        >
          {greeting}, {name || "User"} 👋
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            opacity: 0.8,
            maxWidth: "680px"
          }}
        >
          Here’s your fitness snapshot for today — progress, workouts, recovery,
          and goal tracking all in one place.
        </p>
      </div>
    </div>
  );
}

export default Greeting;