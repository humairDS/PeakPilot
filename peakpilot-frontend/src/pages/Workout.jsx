import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import WorkoutDayCard from "../components/workout/WorkoutDayCard";
import { getDashboard } from "../services/dashboard";
import { regenerateWorkoutPlan } from "../services/workout";

function Workout() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchWorkout = async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Workout fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, []);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      await regenerateWorkoutPlan();
      await fetchWorkout();
    } catch (error) {
      console.error("Workout regenerate failed:", error);
      alert("Failed to regenerate workout plan");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout profile={null}>
        <h1>Loading workout...</h1>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout profile={null}>
        <h1>Failed to load workout</h1>
      </Layout>
    );
  }

  const profile = dashboardData.profile;
  const workoutPlan = dashboardData.latest_plan?.workout || [];

  return (
    <Layout profile={profile}>
      <div className="page-header">
        <h1>Workout Plan</h1>
        <p>Your latest personalized workout schedule.</p>
      </div>

      <div className="mb-4">
        <button className="btn btn-primary" onClick={handleRegenerate} disabled={regenerating}>
          {regenerating ? "Regenerating..." : "Regenerate Workout Plan"}
        </button>
      </div>

      {workoutPlan.length === 0 ? (
        <div className="card">
          <p>No workout plan found yet.</p>
        </div>
      ) : (
        workoutPlan.map((dayPlan, index) => (
          <WorkoutDayCard key={index} dayPlan={dayPlan} />
        ))
      )}
    </Layout>
  );
}

export default Workout;