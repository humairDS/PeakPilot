import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import { getMlRecommendation } from "../services/ml";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [mlRecommendation, setMlRecommendation] = useState(null);
  const [mlLoading, setMlLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Dashboard load error:", error);
      setErrorMsg(
        error.response?.status === 401
          ? "Your session has expired. Please log in again."
          : "We couldn't load your dashboard right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const loadMlRecommendation = async () => {
      setMlLoading(true);
      try {
        const result = await getMlRecommendation();
        setMlRecommendation(result);
      } catch (error) {
        console.error("ML recommendation load error:", error);
        setMlRecommendation({
          success: false,
          message: "Couldn't load your ML recommendation right now.",
        });
      } finally {
        setMlLoading(false);
      }
    };

    loadMlRecommendation();
  }, []);

  // ---- Safe destructuring with sane defaults ----
  const profile = data?.profile || null;
  const latestPlan = data?.latest_plan || null;
  const latestMeal = data?.latest_meal || null;
  const latestProgress = data?.latest_progress || null;
  const weeklySummary = data?.weekly_summary || null;
  const achievements = data?.achievements || [];
  const stats = data?.statistics || null;

  const firstName = profile?.first_name || "Athlete";

  const goal = profile?.goal || "Fat Loss";
  const activityLevel = profile?.activity || "Moderately Active";
  const workoutDays = Number(profile?.workout_days) || 0;
  const workoutDuration = profile?.duration ? `${profile.duration} min` : "--";

  const currentWeight = Number(stats?.current_weight) || 0;
  const targetWeight = Number(stats?.goal_weight) || 0;
  const startWeight = Number(profile?.weight) || currentWeight || targetWeight;
  const goalProgress = Number(stats?.goal_progress) || 0;
  const weightRemaining = stats?.weight_remaining;
  const currentStreak = Number(stats?.current_streak) || 0;

  const calories = Number(latestMeal?.daily_calories) || 0;
  const protein = latestMeal?.protein ?? "--";
  const carbs = latestMeal?.carbs ?? "--";
  const fat = latestMeal?.fat ?? "--";

  const bodyFat = latestProgress?.body_fat ?? "--";
  const sleepHours = latestProgress?.sleep ?? "--";

  const hasWorkoutPlan =
    latestPlan && Array.isArray(latestPlan.workout) && latestPlan.workout.length > 0;

  const hasMealPlan =
    latestMeal && Array.isArray(latestMeal.meal_plan) && latestMeal.meal_plan.length > 0;

  const todayWorkoutCards = useMemo(() => {
    if (!hasWorkoutPlan) return [];

    return latestPlan.workout.slice(0, 4).map((day, index) => ({
      key: index,
      title: day.day || `Day ${index + 1}`,
      meta: day.focus || "Training session",
      value:
        Array.isArray(day.exercises) && day.exercises.length > 0
          ? `${day.exercises.length} exercises`
          : "Planned",
    }));
  }, [hasWorkoutPlan, latestPlan]);

  const todayMealCards = useMemo(() => {
    if (!hasMealPlan) return [];

    return latestMeal.meal_plan.slice(0, 4).map((meal, index) => ({
      key: index,
      title: meal.meal || `Meal ${index + 1}`,
      meta: Array.isArray(meal.foods) ? meal.foods.join(", ") : "Nutrition block",
      value: meal.calories ? `${meal.calories} kcal` : "Planned",
    }));
  }, [hasMealPlan, latestMeal]);

  const coachMessage = useMemo(() => {
    if (!profile) {
      return "Complete your profile to unlock a fully personalized coaching view.";
    }

    if (!hasWorkoutPlan || !hasMealPlan) {
      return "Generate your workout and meal plan to unlock a complete daily execution view.";
    }

    if (currentWeight && targetWeight && currentWeight > targetWeight) {
      const diff = Math.abs(currentWeight - targetWeight).toFixed(1);
      return `You're ${diff} kg away from your target. Keep your protein high, stay consistent with training, and use your weekly progress check-ins to tighten the plan instead of guessing.`;
    }

    if (currentWeight && targetWeight && currentWeight <= targetWeight) {
      return "You've reached your target zone. The next focus should be performance, recovery, and keeping your nutrition tight enough to maintain the result.";
    }

    return "Your dashboard is ready. Log your progress regularly to unlock a more personalized coaching view.";
  }, [profile, hasWorkoutPlan, hasMealPlan, currentWeight, targetWeight]);

  // ---- Loading state ----
  if (loading) {
    return (
      <Layout profile={profile}>
        <div className="dashboard-loading">
          <div className="loading-card">
            <h2>Loading your command center...</h2>
            <p>
              Pulling your profile, nutrition, workouts, and progress so your
              dashboard can build the latest overview.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ---- Error state ----
  if (errorMsg) {
    return (
      <Layout profile={profile}>
        <div className="dashboard-loading">
          <div className="dashboard-error-card">
            <h2>Something went wrong</h2>
            <p>{errorMsg}</p>
            <button className="hero-primary-btn" onClick={loadDashboard}>
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout profile={profile}>
      <div className="dashboard-page">
        {/* HERO */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker">PeakPilot Command Center</div>

              <h1 className="hero-title">
                Welcome back, <span>{firstName}</span>
              </h1>

              <p className="hero-subtitle">
                This is your premium fitness overview — weight target, nutrition,
                training, and progress all in one place so you can stop guessing
                and start executing.
              </p>

              <div className="hero-chip-row">
                <div className="hero-chip">
                  <div className="hero-chip-label">Goal</div>
                  <div className="hero-chip-value">{goal}</div>
                </div>

                <div className="hero-chip">
                  <div className="hero-chip-label">Activity</div>
                  <div className="hero-chip-value">{activityLevel}</div>
                </div>

                <div className="hero-chip">
                  <div className="hero-chip-label">Workout Split</div>
                  <div className="hero-chip-value">
                    {workoutDays ? `${workoutDays} days / week` : "--"}
                  </div>
                </div>
              </div>

              {currentStreak > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <span className="streak-pill">🔥 {currentStreak}-day streak</span>
                </div>
              )}

              <div className="hero-actions">
                <Link to="/progress">
                  <button className="hero-primary-btn">Log New Progress</button>
                </Link>

                <Link to="/profile">
                  <button className="hero-secondary-btn">Update Profile</button>
                </Link>
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-progress-card">
                <div className="hero-progress-head">
                  <div>
                    <div className="hero-progress-label">Target Progress</div>
                    <div className="hero-progress-value">
                      {currentWeight ? `${currentWeight} kg` : "--"}
                    </div>
                    <div className="hero-progress-note">
                      {targetWeight
                        ? `Current weight vs your target of ${targetWeight} kg`
                        : "Set a target weight in your profile"}
                    </div>
                  </div>

                  <div className="badge badge-brand">
                    {Math.round(goalProgress)}% complete
                  </div>
                </div>

                <div className="goal-ring-wrap">
                  <div
                    className="goal-ring"
                    style={{ "--progress": Math.round(goalProgress) }}
                  >
                    <div className="goal-ring-content">
                      <span className="goal-ring-percent">
                        {Math.round(goalProgress)}%
                      </span>
                      <span className="goal-ring-label">toward goal</span>
                    </div>
                  </div>
                </div>

                <div className="hero-mini-stats">
                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-label">Start</div>
                    <div className="hero-mini-stat-value">
                      {startWeight ? `${startWeight} kg` : "--"}
                    </div>
                  </div>

                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-label">Current</div>
                    <div className="hero-mini-stat-value">
                      {currentWeight ? `${currentWeight} kg` : "--"}
                    </div>
                  </div>

                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-label">
                      {weightRemaining != null ? "Remaining" : "Target"}
                    </div>
                    <div className="hero-mini-stat-value">
                      {weightRemaining != null
                        ? `${weightRemaining} kg`
                        : targetWeight
                        ? `${targetWeight} kg`
                        : "--"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI ROW */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-top">
              <div className="metric-label">Daily Calories</div>
              <div className="metric-icon">🔥</div>
            </div>

            <div className="metric-value">{calories || "--"}</div>
            <div className="metric-foot">
              Your current nutrition target for daily intake.
            </div>

            <div className="metric-progress">
              <div className="metric-progress-track">
                <div
                  className="metric-progress-fill"
                  style={{ "--progress": `${Math.min((calories / 3000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-top">
              <div className="metric-label">Protein Target</div>
              <div className="metric-icon">🥩</div>
            </div>

            <div className="metric-value">{protein}</div>
            <div className="metric-foot">
              Daily protein goal to support recovery and muscle retention.
            </div>

            <div className="metric-progress">
              <div className="metric-progress-track">
                <div
                  className="metric-progress-fill"
                  style={{
                    "--progress": `${Math.min(
                      (parseFloat(protein) / 220) * 100 || 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="metric-card purple">
            <div className="metric-top">
              <div className="metric-label">Workout Days</div>
              <div className="metric-icon">🏋️</div>
            </div>

            <div className="metric-value">{workoutDays || "--"}</div>
            <div className="metric-foot">
              Weekly training frequency currently assigned in your plan.
            </div>

            <div className="metric-progress">
              <div className="metric-progress-track">
                <div
                  className="metric-progress-fill"
                  style={{ "--progress": `${Math.min((workoutDays / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-top">
              <div className="metric-label">Consistency Streak</div>
              <div className="metric-icon">⚡</div>
            </div>

            <div className="metric-value">{currentStreak}</div>
            <div className="metric-foot">
              Consecutive days with a completed workout logged.
            </div>

            <div className="metric-progress">
              <div className="metric-progress-track">
                <div
                  className="metric-progress-fill"
                  style={{ "--progress": `${Math.min((currentStreak / 30) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="dashboard-main-grid">
          <div className="dashboard-section">
            {/* TODAY TRAINING + NUTRITION */}
            <div className="dashboard-card">
              <div className="dashboard-card-head">
                <div>
                  <h2 className="dashboard-card-title">Today's execution plan</h2>
                  <p className="dashboard-card-subtitle">
                    A quick snapshot of your current training and nutrition structure.
                  </p>
                </div>
                <div className="badge badge-success">Action Zone</div>
              </div>

              <div className="dashboard-card-body">
                <div className="today-grid">
                  {/* Workout showcase */}
                  <div className="showcase-card">
                    <div className="showcase-banner">
                      <div className="showcase-label">Training Focus</div>
                      <h3 className="showcase-title">{goal} training system</h3>
                      <p className="showcase-copy">
                        {hasWorkoutPlan
                          ? `Your current plan is built around ${workoutDays} weekly sessions with an average workout duration of ${workoutDuration}.`
                          : "You don't have an active workout plan yet."}
                      </p>
                    </div>

                    {hasWorkoutPlan ? (
                      <div className="showcase-list">
                        {todayWorkoutCards.map((item) => (
                          <div className="showcase-item" key={item.key}>
                            <div className="showcase-item-main">
                              <p className="showcase-item-title">{item.title}</p>
                              <p className="showcase-item-meta">{item.meta}</p>
                            </div>
                            <div className="showcase-item-value">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="showcase-list">
                        <Link to="/workout" className="showcase-item">
                          <div className="showcase-item-main">
                            <p className="showcase-item-title">Generate a workout plan</p>
                            <p className="showcase-item-meta">
                              Head to the Workout page to create your first plan
                            </p>
                          </div>
                          <div className="showcase-item-value">→</div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Meal showcase */}
                  <div className="showcase-card">
                    <div className="showcase-banner success">
                      <div className="showcase-label">Nutrition Focus</div>
                      <h3 className="showcase-title">High-protein meal structure</h3>
                      <p className="showcase-copy">
                        {hasMealPlan
                          ? `Your current meal target is ${calories} kcal with ${protein} protein, ${carbs} carbs, and ${fat} fat.`
                          : "You don't have an active meal plan yet."}
                      </p>
                    </div>

                    {hasMealPlan ? (
                      <div className="showcase-list">
                        {todayMealCards.map((item) => (
                          <div className="showcase-item" key={item.key}>
                            <div className="showcase-item-main">
                              <p className="showcase-item-title">{item.title}</p>
                              <p className="showcase-item-meta">{item.meta}</p>
                            </div>
                            <div className="showcase-item-value">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="showcase-list">
                        <Link to="/meal" className="showcase-item">
                          <div className="showcase-item-main">
                            <p className="showcase-item-title">Generate a meal plan</p>
                            <p className="showcase-item-meta">
                              Head to the Meal page to create your first plan
                            </p>
                          </div>
                          <div className="showcase-item-value">→</div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ML RECOMMENDATION ENGINE */}
            <div className="dashboard-card">
              <div className="dashboard-card-head">
                <div>
                  <h2 className="dashboard-card-title">AI recommendation engine</h2>
                  <p className="dashboard-card-subtitle">
                    A machine-learning model trained on your profile data predicts
                    your ideal daily targets.
                  </p>
                </div>
                <div className="badge badge-brand">
                  {mlRecommendation?.source === "ml_model" ? "ML Model" : "Live"}
                </div>
              </div>

              <div className="dashboard-card-body">
                {mlLoading ? (
                  <p style={{ color: "var(--text-soft)" }}>
                    Running your profile through the model...
                  </p>
                ) : mlRecommendation?.success ? (
                  <>
                    <div className="insight-grid">
                      <div className="insight-tile">
                        <div className="insight-label">Predicted Calories</div>
                        <div className="insight-value">
                          {mlRecommendation.target_calories} kcal
                        </div>
                        <div className="insight-note">
                          Model-estimated daily target based on your profile.
                        </div>
                      </div>

                      <div className="insight-tile">
                        <div className="insight-label">Workout Intensity</div>
                        <div className="insight-value">
                          {mlRecommendation.workout_intensity || "--"}
                        </div>
                        <div className="insight-note">
                          Predicted training intensity band for your goal.
                        </div>
                      </div>

                      <div className="insight-tile">
                        <div className="insight-label">Protein</div>
                        <div className="insight-value">
                          {mlRecommendation.macros?.protein}g
                        </div>
                        <div className="insight-note">Recommended daily protein.</div>
                      </div>

                      <div className="insight-tile">
                        <div className="insight-label">Carbs / Fat</div>
                        <div className="insight-value">
                          {mlRecommendation.macros?.carbs}g / {mlRecommendation.macros?.fat}g
                        </div>
                        <div className="insight-note">Recommended daily split.</div>
                      </div>
                    </div>

                    {mlRecommendation.source === "rule_based_fallback" && (
                      <p style={{ marginTop: "14px", color: "var(--text-soft)", fontSize: "0.85rem" }}>
                        {mlRecommendation.note}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="showcase-list">
                    <Link to="/profile" className="showcase-item">
                      <div className="showcase-item-main">
                        <p className="showcase-item-title">Complete your profile</p>
                        <p className="showcase-item-meta">
                          {mlRecommendation?.message ||
                            "Fill in your profile to unlock ML-powered recommendations."}
                        </p>
                      </div>
                      <div className="showcase-item-value">→</div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS INTELLIGENCE */}
            <div className="dashboard-card">
              <div className="dashboard-card-head">
                <div>
                  <h2 className="dashboard-card-title">Progress intelligence</h2>
                  <p className="dashboard-card-subtitle">
                    Your latest body metrics and recovery signals in one block.
                  </p>
                </div>
                <Link to="/progress" className="badge badge-brand">
                  Open progress
                </Link>
              </div>

              <div className="dashboard-card-body">
                <div className="insight-grid">
                  <div className="insight-tile">
                    <div className="insight-label">Current Weight</div>
                    <div className="insight-value">
                      {currentWeight ? `${currentWeight} kg` : "--"}
                    </div>
                    <div className="insight-note">
                      Latest logged weight used as your current benchmark.
                    </div>
                  </div>

                  <div className="insight-tile">
                    <div className="insight-label">Target Weight</div>
                    <div className="insight-value">
                      {targetWeight ? `${targetWeight} kg` : "--"}
                    </div>
                    <div className="insight-note">
                      This is the weight your current plan is pushing toward.
                    </div>
                  </div>

                  <div className="insight-tile">
                    <div className="insight-label">Body Fat</div>
                    <div className="insight-value">
                      {bodyFat !== "--" ? `${bodyFat}%` : "--"}
                    </div>
                    <div className="insight-note">
                      Logged body fat from your most recent progress update.
                    </div>
                  </div>

                  <div className="insight-tile">
                    <div className="insight-label">Sleep / Recovery</div>
                    <div className="insight-value">
                      {sleepHours !== "--" ? `${sleepHours} hrs` : "--"}
                    </div>
                    <div className="insight-note">
                      Recovery matters. Better sleep usually means better training output.
                    </div>
                  </div>
                </div>

                {weeklySummary && (
                  <div className="insight-grid" style={{ marginTop: "16px" }}>
                    <div className="insight-tile">
                      <div className="insight-label">Workouts This Week</div>
                      <div className="insight-value">
                        {weeklySummary.workouts_completed}
                      </div>
                      <div className="insight-note">Completed in the last 7 days.</div>
                    </div>

                    <div className="insight-tile">
                      <div className="insight-label">Avg Sleep</div>
                      <div className="insight-value">
                        {weeklySummary.average_sleep
                          ? `${weeklySummary.average_sleep} hrs`
                          : "--"}
                      </div>
                      <div className="insight-note">7-day rolling average.</div>
                    </div>

                    <div className="insight-tile">
                      <div className="insight-label">Avg Water</div>
                      <div className="insight-value">
                        {weeklySummary.average_water
                          ? `${weeklySummary.average_water} L`
                          : "--"}
                      </div>
                      <div className="insight-note">7-day rolling average.</div>
                    </div>

                    <div className="insight-tile">
                      <div className="insight-label">Weekly Weight Change</div>
                      <div className="insight-value">
                        {weeklySummary.weight_change > 0 ? "+" : ""}
                        {weeklySummary.weight_change} kg
                      </div>
                      <div className="insight-note">Change over the last 7 days.</div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "18px" }} className="coach-card">
                  <h3>Coach note</h3>
                  <p>{coachMessage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="dashboard-section">
            <div className="dashboard-card momentum-card">
              <div className="dashboard-card-head">
                <div>
                  <h2 className="dashboard-card-title">Momentum & wins</h2>
                  <p className="dashboard-card-subtitle">
                    Achievements earned from your real activity.
                  </p>
                </div>
                <div className="badge badge-warning">Momentum</div>
              </div>

              <div className="dashboard-card-body">
                <div className="achievement-list">
                  {achievements.map((item, index) => (
                    <div
                      className={`achievement-item ${item.earned ? "" : "locked"}`}
                      key={index}
                    >
                      <div className="achievement-icon">
                        {item.earned ? "🏆" : "🔒"}
                      </div>
                      <div className="achievement-content">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                      <span
                        className={`achievement-status ${
                          item.earned ? "earned" : "locked"
                        }`}
                      >
                        {item.earned ? "Earned" : "Locked"}
                      </span>
                    </div>
                  ))}

                  {achievements.length === 0 && (
                    <p style={{ color: "var(--text-soft)" }}>
                      Start logging progress to unlock achievements.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-head">
                <div>
                  <h2 className="dashboard-card-title">Quick actions</h2>
                  <p className="dashboard-card-subtitle">
                    Jump directly into the parts of PeakPilot you'll use most.
                  </p>
                </div>
              </div>

              <div className="dashboard-card-body">
                <div className="showcase-list">
                  <Link to="/meal" className="showcase-item">
                    <div className="showcase-item-main">
                      <p className="showcase-item-title">Open Meal Plan</p>
                      <p className="showcase-item-meta">
                        Review calories, meals, and nutrition targets
                      </p>
                    </div>
                    <div className="showcase-item-value">→</div>
                  </Link>

                  <Link to="/workout" className="showcase-item">
                    <div className="showcase-item-main">
                      <p className="showcase-item-title">Open Workout Plan</p>
                      <p className="showcase-item-meta">
                        Review split, exercises, and weekly structure
                      </p>
                    </div>
                    <div className="showcase-item-value">→</div>
                  </Link>

                  <Link to="/progress" className="showcase-item">
                    <div className="showcase-item-main">
                      <p className="showcase-item-title">Log Progress</p>
                      <p className="showcase-item-meta">
                        Add new weight, body fat, and recovery updates
                      </p>
                    </div>
                    <div className="showcase-item-value">→</div>
                  </Link>

                  <Link to="/profile" className="showcase-item">
                    <div className="showcase-item-main">
                      <p className="showcase-item-title">Update Profile</p>
                      <p className="showcase-item-meta">
                        Adjust goal, target weight, and account settings
                      </p>
                    </div>
                    <div className="showcase-item-value">→</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;
