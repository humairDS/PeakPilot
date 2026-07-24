import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getDashboard } from "../services/dashboard";
import { getMlAccuracy } from "../services/ml";

function ModelPerformance() {
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const [dashboardData, accuracyData] = await Promise.all([
        getDashboard().catch(() => null),
        getMlAccuracy(),
      ]);

      if (dashboardData?.profile) {
        setProfile(dashboardData.profile);
      }

      setMetrics(accuracyData);
    } catch (error) {
      console.error("Model performance fetch failed:", error);
      setErrorMsg("Couldn't load model performance data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout profile={profile}>
        <div className="dashboard-loading">
          <div className="loading-card">
            <h2>Loading model performance...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (errorMsg || !metrics?.available) {
    return (
      <Layout profile={profile}>
        <div className="dashboard-loading">
          <div className="dashboard-error-card">
            <h2>Model metrics unavailable</h2>
            <p>
              {metrics?.message ||
                errorMsg ||
                "No trained model metrics were found."}
            </p>
            <button className="primary-btn" onClick={fetchData}>
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const calorieModel = metrics.calorie_model || {};
  const intensityModel = metrics.intensity_model || {};
  const featureColumns = metrics.feature_columns || [];

  return (
    <Layout profile={profile}>
      <div className="page-header">
        <div className="page-title-block">
          <h1>ML Model Performance</h1>
          <p>
            Evaluation results for the machine-learning models powering
            PeakPilot's live recommendations, measured on a held-out 20% test
            split.
          </p>
        </div>
      </div>

      <div className="inline-alert success" style={{ marginBottom: "24px" }}>
        These metrics describe the trained model itself, not any individual
        account — every user sees the same numbers here, since it's one
        shared model serving all accounts. Your personal prediction (calorie
        target and workout intensity) is on your Dashboard instead.
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-label">Calorie Model R²</div>
            <div className="metric-icon">📈</div>
          </div>
          <div className="metric-value">{calorieModel.r2_score}</div>
          <div className="metric-foot">
            Proportion of variance in target calories explained by the model.
            Closer to 1.0 is better.
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-top">
            <div className="metric-label">Calorie Model MAE</div>
            <div className="metric-icon">🎯</div>
          </div>
          <div className="metric-value">{calorieModel.mae} kcal</div>
          <div className="metric-foot">
            Mean Absolute Error — on average, predictions are off by this many
            calories.
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-top">
            <div className="metric-label">Intensity Accuracy</div>
            <div className="metric-icon">✅</div>
          </div>
          <div className="metric-value">
            {Math.round((intensityModel.accuracy || 0) * 100)}%
          </div>
          <div className="metric-foot">
            Percentage of test cases where the predicted intensity band
            (Low/Moderate/High) matched the expected label.
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-top">
            <div className="metric-label">Intensity F1 (macro)</div>
            <div className="metric-icon">⚖️</div>
          </div>
          <div className="metric-value">{intensityModel.f1_macro}</div>
          <div className="metric-foot">
            Balances precision and recall equally across all three intensity
            classes, even if some are rarer than others.
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div>
                <h2 className="dashboard-card-title">Calorie Prediction Model</h2>
                <p className="dashboard-card-subtitle">
                  Regression model predicting daily target calories.
                </p>
              </div>
              <div className="badge badge-brand">{calorieModel.type}</div>
            </div>

            <div className="dashboard-card-body">
              <div className="insight-grid">
                <div className="insight-tile">
                  <div className="insight-label">R² Score</div>
                  <div className="insight-value">{calorieModel.r2_score}</div>
                  <div className="insight-note">Higher is better (max 1.0).</div>
                </div>

                <div className="insight-tile">
                  <div className="insight-label">Mean Absolute Error</div>
                  <div className="insight-value">{calorieModel.mae} kcal</div>
                  <div className="insight-note">Lower is better.</div>
                </div>

                <div className="insight-tile">
                  <div className="insight-label">Test Samples</div>
                  <div className="insight-value">{calorieModel.test_samples}</div>
                  <div className="insight-note">Held-out, unseen during training.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div>
                <h2 className="dashboard-card-title">Workout Intensity Model</h2>
                <p className="dashboard-card-subtitle">
                  Classification model predicting Low / Moderate / High intensity.
                </p>
              </div>
              <div className="badge badge-brand">{intensityModel.type}</div>
            </div>

            <div className="dashboard-card-body">
              <div className="insight-grid">
                <div className="insight-tile">
                  <div className="insight-label">Accuracy</div>
                  <div className="insight-value">
                    {Math.round((intensityModel.accuracy || 0) * 100)}%
                  </div>
                  <div className="insight-note">Overall correct predictions.</div>
                </div>

                <div className="insight-tile">
                  <div className="insight-label">F1 Score (macro)</div>
                  <div className="insight-value">{intensityModel.f1_macro}</div>
                  <div className="insight-note">Equal weight per class.</div>
                </div>

                <div className="insight-tile">
                  <div className="insight-label">Test Samples</div>
                  <div className="insight-value">{intensityModel.test_samples}</div>
                  <div className="insight-note">
                    Classes: {(intensityModel.classes || []).join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div>
                <h2 className="dashboard-card-title">Methodology</h2>
                <p className="dashboard-card-subtitle">
                  How these models were built and evaluated.
                </p>
              </div>
            </div>

            <div className="dashboard-card-body">
              <p style={{ color: "var(--text-soft)", lineHeight: 1.7 }}>
                Both models are Random Forests trained on{" "}
                <strong>{metrics.training_samples}</strong> synthetic samples,
                generated from established BMR/TDEE fitness formulas
                (Mifflin-St Jeor equation) with realistic human-measurement
                noise added, since no real-world dataset was available at
                build time. An 80/20 train/test split was used, and all
                metrics above are computed on the unseen 20% test portion
                only.
              </p>

              <p className="sub-heading" style={{ marginTop: "20px" }}>
                Input features used by both models
              </p>
              <div className="exercise-meta">
                {featureColumns.map((col) => (
                  <span className="exercise-meta-chip" key={col}>
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ModelPerformance;
