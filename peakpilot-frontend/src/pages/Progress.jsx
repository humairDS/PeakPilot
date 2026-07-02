import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getProgress, addProgress } from "../services/progress";

function Progress() {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    weight: "",
    body_fat: "",
    sleep: "",
    water: "",
    energy: "",
    workout_completed: false,
    notes: ""
  });

  const fetchProgressData = async () => {
    try {
      const progressData = await getProgress();
      setProgressEntries(progressData || []);
    } catch (error) {
      console.error("Progress fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


  const payload = {
    weight: formData.weight === "" ? null : parseFloat(formData.weight),
    body_fat: formData.body_fat === "" ? null : parseFloat(formData.body_fat),
    sleep: formData.sleep === "" ? null : parseFloat(formData.sleep),
    water: formData.water === "" ? null : parseFloat(formData.water),
    energy: formData.energy === "" ? null : parseInt(formData.energy, 10),
    workout_completed: formData.workout_completed,
    notes: formData.notes?.trim() || null
  };

  console.log("Submitting progress payload:", payload);

    try {
      await addProgress(formData);

      setFormData({
        weight: "",
        body_fat: "",
        sleep: "",
        water: "",
        energy: "",
        workout_completed: false,
        notes: ""
      });

      await fetchProgressData();
      alert("Progress added successfully");
    } catch (error) {
      console.error("Add progress failed:", error);
      console.log("Backend error response:",error?.response?.data);
      alert("Failed to add progress");
    }
  };

  if (loading) {
    return (
      <Layout>
        <h1>Loading progress...</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Progress Tracker</h1>
        <p>Track your fitness journey and daily progress.</p>
      </div>

      <div className="card mb-2">
        <h3 className="mb-2">Add Progress Entry</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid-2 mb-2">
            <div>
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Body Fat %</label>
              <input
                type="number"
                step="0.1"
                name="body_fat"
                value={formData.body_fat}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Sleep (hours)</label>
              <input
                type="number"
                step="0.1"
                name="sleep"
                value={formData.sleep}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Water (liters)</label>
              <input
                type="number"
                step="0.1"
                name="water"
                value={formData.water}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Energy (1–10)</label>
              <input
                type="number"
                name="energy"
                value={formData.energy}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "28px" }}>
              <input
                type="checkbox"
                name="workout_completed"
                checked={formData.workout_completed}
                onChange={handleChange}
              />
              <label>Workout Completed</label>
            </div>
          </div>

          <div className="mb-2">
            <label>Notes</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Progress
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="mb-2">Progress History</h3>

        {progressEntries.length === 0 ? (
          <p>No progress entries yet.</p>
        ) : (
          progressEntries.map((entry, index) => (
            <div
              key={index}
              className="card"
              style={{ marginBottom: "12px", background: "var(--surface2)" }}
            >
              <p><strong>Date:</strong> {entry.created_at || "N/A"}</p>
              <p><strong>Weight:</strong> {entry.weight ?? "N/A"} kg</p>
              <p><strong>Body Fat:</strong> {entry.body_fat ?? "N/A"}%</p>
              <p><strong>Sleep:</strong> {entry.sleep ?? "N/A"} hrs</p>
              <p><strong>Water:</strong> {entry.water ?? "N/A"} L</p>
              <p><strong>Energy:</strong> {entry.energy ?? "N/A"}/10</p>
              <p><strong>Workout Completed:</strong> {entry.workout_completed ? "Yes" : "No"}</p>
              <p><strong>Notes:</strong> {entry.notes || "—"}</p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default Progress;