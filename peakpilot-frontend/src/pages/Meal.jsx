import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getDashboard } from "../services/dashboard";
import { getLatestMealPlan, regenerateMealPlan } from "../services/meal";

function Meal() {
  const [profile, setProfile] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchMealData = async () => {
    try {
      const dashboardData = await getDashboard();
      setProfile(dashboardData.profile);

      const data = await getLatestMealPlan();
      setMealData(data);
    } catch (error) {
      console.error("Meal fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealData();
  }, []);

  const handleRegenerate = async () => {
    setStatusMsg(null);
    try {
      setRegenerating(true);
      await regenerateMealPlan();
      await fetchMealData();
      setStatusMsg({ type: "success", text: "Meal plan regenerated successfully." });
    } catch (error) {
      console.error("Meal regenerate failed:", error);
      setStatusMsg({ type: "error", text: "Failed to regenerate meal plan." });
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout profile={profile}>
        <div className="dashboard-loading">
          <div className="loading-card">
            <h2>Loading your meal plan...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  // meal_plan is an array of { meal, foods, calories }
  const meals = Array.isArray(mealData?.meal_plan) ? mealData.meal_plan : [];

  return (
    <Layout profile={profile}>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Meal Plan</h1>
          <p>Your latest AI-generated, personalized nutrition plan.</p>
        </div>
        <div className="page-actions">
          <button
            className="primary-btn"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? "Regenerating..." : "Regenerate Meal Plan"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`inline-alert ${statusMsg.type}`}>{statusMsg.text}</div>
      )}

      {mealData?.daily_calories && (
        <div className="calorie-summary-strip">
          <div className="calorie-summary-tile">
            <div className="entry-stat-label">Daily Calories</div>
            <div className="calorie-summary-value">{mealData.daily_calories}</div>
          </div>
          <div className="calorie-summary-tile">
            <div className="entry-stat-label">Protein</div>
            <div className="calorie-summary-value">{mealData.protein ?? "--"}g</div>
          </div>
          <div className="calorie-summary-tile">
            <div className="entry-stat-label">Carbs</div>
            <div className="calorie-summary-value">{mealData.carbs ?? "--"}g</div>
          </div>
          <div className="calorie-summary-tile">
            <div className="entry-stat-label">Fat</div>
            <div className="calorie-summary-value">{mealData.fat ?? "--"}g</div>
          </div>
        </div>
      )}

      {meals.length === 0 ? (
        <div className="meal-card">
          <div className="panel-body">
            <div className="empty-state">
              No meal plan found yet — click "Regenerate Meal Plan" to create one.
            </div>
          </div>
        </div>
      ) : (
        meals.map((meal, index) => (
          <div key={index} className="meal-card mb-3">
            <div className="panel-body">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">{meal.meal || `Meal ${index + 1}`}</h3>
                </div>
                {meal.calories && (
                  <div className="badge badge-success">{meal.calories} kcal</div>
                )}
              </div>

              {(meal.foods || meal.items || meal.ingredients || []).map((food, i) => (
                <div key={i} className="food-item">
                  {food}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Layout>
  );
}

export default Meal;
