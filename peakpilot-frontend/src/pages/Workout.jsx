import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import WorkoutDayCard from "../components/workout/WorkoutDayCard";
import { getDashboard } from "../services/dashboard";
import { regenerateWorkoutPlan } from "../services/workout";

function Workout() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const data = await getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Workout fetch failed:", error);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, []);

  const handleRegenerate = async () => {
    setStatusMsg(null);
    try {
      setRegenerating(true);
      await regenerateWorkoutPlan();
      await fetchWorkout();
      setStatusMsg({ type: "success", text: "Workout plan regenerated successfully." });
    } catch (error) {
      console.error("Workout regenerate failed:", error);
      setStatusMsg({ type: "error", text: "Failed to regenerate workout plan." });
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout profile={null}>
        <div className="dashboard-loading">
          <div className="loading-card">
            <h2>Loading your workout plan...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout profile={null}>
        <div className="dashboard-loading">
          <div className="dashboard-error-card">
            <h2>Couldn't load your workout plan</h2>
            <p>Something went wrong fetching your data. Please try again.</p>
            <button className="primary-btn" onClick={fetchWorkout}>
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const profile = dashboardData.profile || null;

  const latestPlan = dashboardData.latest_plan || {};
  const workoutPlan = Array.isArray(latestPlan.workout) ? latestPlan.workout : [];

  return (
    <Layout profile={profile}>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Workout Plan</h1>
          <p>Your latest AI-generated, personalized training schedule.</p>
        </div>
        <div className="page-actions">
          <button
            className="primary-btn"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? "Regenerating..." : "Regenerate Workout Plan"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`inline-alert ${statusMsg.type}`}>{statusMsg.text}</div>
      )}

      {workoutPlan.length === 0 ? (
        <div className="workout-card">
          <div className="panel-body">
            <div className="empty-state">
              No workout plan found yet — click "Regenerate Workout Plan" to create one.
            </div>
          </div>
        </div>
      ) : (
        <div className="list-stack">
          {workoutPlan.map((dayPlan, index) => (
            <WorkoutDayCard key={index} dayPlan={dayPlan} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Workout;
