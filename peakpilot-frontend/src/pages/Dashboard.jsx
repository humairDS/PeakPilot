import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Greeting from "../components/dashboard/Greeting";
import StatCard from "../components/dashboard/StatCard";
import WeeklySummary from "../components/dashboard/WeeklySummary";
import { getDashboard } from "../services/dashboard";
import LatestProgress from "../components/dashboard/LatestProgress";
import LatestPlan from "../components/dashboard/LatestPlan";
import Achievements from "../components/dashboard/Achievements";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout profile={null}>
        <h1>Loading dashboard...</h1>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout profile={null}>
        <h1>Failed to load dashboard</h1>
      </Layout>
    );
  }

  const stats = dashboardData.statistics;
  const profile = dashboardData.profile;

  return (
    <Layout profile={profile}>
      <Greeting name={profile.first_name} />

      <div className="grid-4 mb-2">
        <StatCard
          title="Current Weight"
          value={`${stats.current_weight ?? profile.weight ?? 0} kg`}
          color="#1d9e75"
        />

        <StatCard
          title="Goal Weight"
          value={`${stats.goal_weight ?? profile.goal_weight ?? 0} kg`}
          color="#534ab7"
        />

        <StatCard
          title="Goal Progress"
          value={`${stats.goal_progress ?? 0}%`}
          color="#378add"
        />

        <StatCard
          title="Current Streak"
          value={`${stats.current_streak ?? 0} Days`}
          color="#e24b4a"
        />
      </div>

      <WeeklySummary weekly={dashboardData.weekly_summary} />

      <div className="grid-2 mb-2">
      <LatestProgress progress={dashboardData.latest_progress} />
      <LatestPlan plan={dashboardData.latest_plan} />
      </div>

      <Achievements achievements={dashboardData.achievements} />


    </Layout>
  );
}

export default Dashboard;