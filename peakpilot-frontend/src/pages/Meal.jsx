import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MealCard from "../components/meal/MealCard";
import { getDashboard } from "../services/dashboard";

function Meal() {
  const [profile, setProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealData = async () => {
    try {
      const dashboardData = await getDashboard();

      setProfile(dashboardData.profile);
      const latestMeal = dashboardData.latest_meal;
      if (Array.isArray(latestMeal)) {
        setMealPlan(latestMeal);
      } else if (latestMeal?.meal_plan && Array.isArray(latestMeal.meal_plan)) {
        setMealPlan(latestMeal.meal_plan);
      } else if (latestMeal?.days && Array.isArray(latestMeal.days)) {
        setMealPlan(latestMeal.days);
      } else {
        setMealPlan([]);
      }
    } catch (error) {
      console.error("Meal fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealData();
  }, []);

  if (loading) {
    return (
      <Layout profile={null}>
        <h1>Loading meal plan...</h1>
      </Layout>
    );
  }

  return (
    <Layout profile={profile}>
      <div className="page-header">
        <h1>Meal Plan</h1>
        <p>Your latest personalized meal plan.</p>
      </div>

      {mealPlan.length === 0 ? (
        <div className="card">
          <p>No meal plan found yet.</p>
        </div>
      ) : (
        mealPlan.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))
      )}
    </Layout>
  );
}

export default Meal;