function StatCard({ title, value, color }) {
  return (
    <div className="card">
      <div
        style={{
          color: color,
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <h2
        style={{
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default StatCard;