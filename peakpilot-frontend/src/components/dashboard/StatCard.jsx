function StatCard({ title, value, color }) {
  return (
    <div
      className="card"
      style={{
        padding: "22px",
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
        minHeight: "130px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: `${color}22`,
          filter: "blur(2px)"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1
        }}
      >
        <p
          style={{
            margin: 0,
            color,
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: 0.95
          }}
        >
          {title}
        </p>
      </div>

      <h2
        style={{
          margin: 0,
          position: "relative",
          zIndex: 1,
          fontSize: "32px",
          fontWeight: "800",
          lineHeight: 1.1
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default StatCard;