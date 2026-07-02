function Achievements({ achievements }) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-4 text-xl font-bold">Achievements</h3>
        <p>No achievements yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-xl font-bold">Achievements</h3>

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            {typeof achievement === "string" ? (
              <p>{achievement}</p>
            ) : (
              <>
                <p className="font-semibold">
                  {achievement.title || achievement.name || "Achievement"}
                </p>
                {achievement.description && (
                  <p className="text-sm opacity-80">{achievement.description}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;