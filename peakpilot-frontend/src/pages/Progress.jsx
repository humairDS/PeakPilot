import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getProgress, addProgress } from "../services/progress";
import { getDashboard } from "../services/dashboard";

function Progress() {
  const [sidebarProfile, setSidebarProfile] = useState(null);
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const [formData, setFormData] = useState({
    weight: "",
    body_fat: "",
    sleep: "",
    water: "",
    energy: "",
    workout_completed: false,
    notes: "",
  });

  const fetchProgressData = async () => {
    try {
      const [progressData, dashboardData] = await Promise.all([
        getProgress(),
        getDashboard().catch(() => null),
      ]);

      setProgressEntries(progressData || []);

      if (dashboardData?.profile) {
        setSidebarProfile(dashboardData.profile);
      }
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setSaving(true);

    try {
      await addProgress(formData);

      setFormData({
        weight: "",
        body_fat: "",
        sleep: "",
        water: "",
        energy: "",
        workout_completed: false,
        notes: "",
      });

      await fetchProgressData();
      setStatusMsg({ type: "success", text: "Progress entry saved." });
    } catch (error) {
      console.error("Add progress failed:", error);
      console.log("Backend error response:", error?.response?.data);
      setStatusMsg({
        type: "error",
        text: "Failed to save your progress entry. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout profile={sidebarProfile}>
        <div className="dashboard-loading">
          <div className="loading-card">
            <h2>Loading your progress...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout profile={sidebarProfile}>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Progress Tracker</h1>
          <p>Log your daily stats to track trends and unlock achievements.</p>
        </div>
      </div>

      <div className="progress-card mb-3">
        <div className="panel-body">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Add Progress Entry</h3>
              <p className="panel-subtitle">
                A quick daily check-in — only weight is required.
              </p>
            </div>
          </div>

          {statusMsg && (
            <div className={`inline-alert ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-3 mb-3">
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 80.5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  name="body_fat"
                  value={formData.body_fat}
                  onChange={handleChange}
                  placeholder="e.g. 18.5"
                />
              </div>

              <div className="form-group">
                <label>Sleep (hours)</label>
                <input
                  type="number"
                  step="0.1"
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                />
              </div>

              <div className="form-group">
                <label>Water (liters)</label>
                <input
                  type="number"
                  step="0.1"
                  name="water"
                  value={formData.water}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                />
              </div>

              <div className="form-group">
                <label>Energy (1–10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  name="energy"
                  value={formData.energy}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                />
              </div>

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="workout_completed"
                  name="workout_completed"
                  checked={formData.workout_completed}
                  onChange={handleChange}
                />
                <label htmlFor="workout_completed" style={{ margin: 0 }}>
                  Workout Completed Today
                </label>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Notes</label>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="How did today feel? Any soreness, wins, or setbacks?"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Progress"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="progress-card">
        <div className="panel-body">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Progress History</h3>
              <p className="panel-subtitle">
                Your most recent entries, newest first.
              </p>
            </div>
            <div className="badge badge-brand">{progressEntries.length} entries</div>
          </div>

          {progressEntries.length === 0 ? (
            <div className="empty-state">
              No progress entries yet — add your first one above.
            </div>
          ) : (
            <div className="list-stack">
              {progressEntries.map((entry, index) => (
                <div key={index} className="list-item">
                  <div className="entry-stat-grid">
                    <div className="entry-stat">
                      <div className="entry-stat-label">Weight</div>
                      <div className="entry-stat-value">{entry.weight ?? "—"} kg</div>
                    </div>
                    <div className="entry-stat">
                      <div className="entry-stat-label">Body Fat</div>
                      <div className="entry-stat-value">
                        {entry.body_fat != null ? `${entry.body_fat}%` : "—"}
                      </div>
                    </div>
                    <div className="entry-stat">
                      <div className="entry-stat-label">Sleep</div>
                      <div className="entry-stat-value">
                        {entry.sleep != null ? `${entry.sleep}h` : "—"}
                      </div>
                    </div>
                    <div className="entry-stat">
                      <div className="entry-stat-label">Water</div>
                      <div className="entry-stat-value">
                        {entry.water != null ? `${entry.water}L` : "—"}
                      </div>
                    </div>
                    <div className="entry-stat">
                      <div className="entry-stat-label">Energy</div>
                      <div className="entry-stat-value">
                        {entry.energy != null ? `${entry.energy}/10` : "—"}
                      </div>
                    </div>
                  </div>

                  {entry.notes && (
                    <p style={{ color: "var(--text-soft)", margin: "10px 0 0" }}>
                      {entry.notes}
                    </p>
                  )}

                  <div className="entry-footer">
                    <span>
                      {entry.created_at
                        ? new Date(entry.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </span>
                    <span
                      className={`badge ${
                        entry.workout_completed ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {entry.workout_completed ? "Workout Done" : "No Workout"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Progress;
