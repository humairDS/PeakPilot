function LatestProgress({ progress }) {
  if (!progress) {
    return (
      <div className="card">
        <h3 className="mb-4 text-xl font-bold">Latest Progress</h3>
        <p>No progress data yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-xl font-bold">Latest Progress</h3>

      <div className="space-y-2">
        <p><strong>Weight:</strong> {progress.weight ?? "-"} kg</p>
        <p><strong>Body Fat:</strong> {progress.body_fat ?? "-"}%</p>
        <p><strong>Sleep:</strong> {progress.sleep ?? "-"} hrs</p>
        <p><strong>Water:</strong> {progress.water ?? "-"} L</p>
        <p><strong>Energy:</strong> {progress.energy ?? "-"} / 10</p>
        <p><strong>Workout Completed:</strong> {progress.workout_completed ? "Yes" : "No"}</p>
        <p><strong>Date:</strong> {progress.created_at ?? "-"}</p>
        {progress.notes && <p><strong>Notes:</strong> {progress.notes}</p>}
      </div>
    </div>
  );
}

export default LatestProgress;