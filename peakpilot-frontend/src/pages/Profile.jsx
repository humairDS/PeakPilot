import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getProfile, saveProfile } from "../services/profile";
import { getDashboard } from "../services/dashboard";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getProfile, saveProfile } from "../services/profile";
import { getDashboard } from "../services/dashboard";

const GENDER_OPTIONS = ["male", "female"];

const GOAL_OPTIONS = [
  "fat loss",
  "muscle gain",
  "maintenance",
  "recomposition",
  "endurance",
];

const ACTIVITY_OPTIONS = [
  "sedentary",
  "lightly active",
  "moderately active",
  "very active",
  "extremely active",
];

const WORKOUT_TYPE_OPTIONS = [
  "strength",
  "cardio",
  "hiit",
  "hybrid",
  "yoga",
  "mixed",
];

const EQUIPMENT_OPTIONS = [
  "full gym access",
  "home — dumbbells only",
  "home — resistance bands",
  "bodyweight only (no equipment)",
];

function Profile() {
  const [sidebarProfile, setSidebarProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text }

  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goalWeight: "",
    goal: "",
    activity: "",
    workoutDays: "",
    workoutType: "",
    duration: "",
    diet: "",
    conditions: "",
    sleep: "",
    water: "",
    equipment: "",
  });

  const fetchProfile = async () => {
    try {
      const [profileData, dashboardData] = await Promise.all([
        getProfile(),
        getDashboard().catch(() => null),
      ]);

      if (profileData?.profile) {
        setProfile({
          age: profileData.profile.age ?? "",
          gender: profileData.profile.gender ?? "",
          height: profileData.profile.height ?? "",
          weight: profileData.profile.weight ?? "",
          goalWeight: profileData.profile.goalWeight ?? "",
          goal: profileData.profile.goal ?? "",
          activity: profileData.profile.activity ?? "",
          workoutDays: profileData.profile.workoutDays ?? "",
          workoutType: profileData.profile.workoutType ?? "",
          duration: profileData.profile.duration ?? "",
          diet: profileData.profile.diet ?? "",
          conditions: profileData.profile.conditions ?? "",
          sleep: profileData.profile.sleep ?? "",
          water: profileData.profile.water ?? "",
          equipment: profileData.profile.equipment ?? "",
        });
      }

      if (dashboardData?.profile) {
        setSidebarProfile(dashboardData.profile);
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    const payload = {
      age: profile.age === "" ? null : parseInt(profile.age, 10),
      gender: profile.gender || "",
      height: profile.height === "" ? null : parseFloat(profile.height),
      weight: profile.weight === "" ? null : parseFloat(profile.weight),
      goalWeight: profile.goalWeight === "" ? null : parseFloat(profile.goalWeight),
      goal: profile.goal || "",
      activity: profile.activity || "",
      workoutDays: profile.workoutDays === "" ? null : parseInt(profile.workoutDays, 10),
      workoutType: profile.workoutType || "",
      duration: profile.duration === "" ? null : parseInt(profile.duration, 10),
      diet: profile.diet || "",
      conditions: profile.conditions || "",
      sleep: profile.sleep === "" ? null : parseFloat(profile.sleep),
      water: profile.water === "" ? null : parseFloat(profile.water),
      equipment: profile.equipment || "",
    };

    setSaving(true);

    try {
      await saveProfile(payload);
      setStatusMsg({ type: "success", text: "Profile saved successfully." });
      await fetchProfile();
    } catch (error) {
      console.error("Profile save failed:", error);
      console.log("Backend error response:", error?.response?.data);
      setStatusMsg({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Failed to save profile. Please check your details and try again.",
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
            <h2>Loading your profile...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout profile={sidebarProfile}>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Your Profile</h1>
          <p>
            These details power your Gemini-generated plans and your ML-based
            calorie &amp; workout intensity predictions — the more accurate,
            the better your recommendations.
          </p>
        </div>
      </div>

      <div className="profile-card">
        <div className="panel-body">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Profile Information</h3>
              <p className="panel-subtitle">
                Update your body stats, goals, and preferences at any time.
              </p>
            </div>
          </div>

          {statusMsg && (
            <div className={`inline-alert ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <p className="sub-heading">Body stats</p>
            <div className="form-grid-3 mb-3">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange} required>
                  <option value="" disabled>Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleChange}
                  placeholder="e.g. 178"
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={profile.weight}
                  onChange={handleChange}
                  placeholder="e.g. 82"
                  required
                />
              </div>

              <div className="form-group">
                <label>Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="goalWeight"
                  value={profile.goalWeight}
                  onChange={handleChange}
                  placeholder="e.g. 75"
                />
              </div>

              <div className="form-group">
                <label>Goal</label>
                <select name="goal" value={profile.goal} onChange={handleChange} required>
                  <option value="" disabled>Select goal</option>
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="sub-heading">Training &amp; lifestyle</p>
            <div className="form-grid-3 mb-3">
              <div className="form-group">
                <label>Activity Level</label>
                <select name="activity" value={profile.activity} onChange={handleChange} required>
                  <option value="" disabled>Select activity level</option>
                  {ACTIVITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Workout Days / Week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  name="workoutDays"
                  value={profile.workoutDays}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                />
              </div>

              <div className="form-group">
                <label>Workout Type</label>
                <select name="workoutType" value={profile.workoutType} onChange={handleChange}>
                  <option value="" disabled>Select workout type</option>
                  {WORKOUT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Session Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={profile.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                />
              </div>

              <div className="form-group">
                <label>Sleep (hours/night)</label>
                <input
                  type="number"
                  step="0.1"
                  name="sleep"
                  value={profile.sleep}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                />
              </div>

              <div className="form-group">
                <label>Water Intake (liters/day)</label>
                <input
                  type="number"
                  step="0.1"
                  name="water"
                  value={profile.water}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                />
              </div>

              <div className="form-group">
                <label>Equipment Available</label>
                <select name="equipment" value={profile.equipment} onChange={handleChange}>
                  <option value="" disabled>Select equipment access</option>
                  {EQUIPMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="sub-heading">Diet &amp; health notes</p>
            <div className="form-grid mb-3">
              <div className="form-group">
                <label>Diet Preference</label>
                <input
                  type="text"
                  name="diet"
                  value={profile.diet}
                  onChange={handleChange}
                  placeholder="e.g. balanced, vegetarian, keto, high-protein"
                />
              </div>

              <div className="form-group">
                <label>Medical Conditions</label>
                <input
                  type="text"
                  name="conditions"
                  value={profile.conditions}
                  onChange={handleChange}
                  placeholder="e.g. none, knee injury, asthma"
                />
              </div>
            </div>

            <p className="helper-text mb-2">
              Gender, goal, and activity level use fixed options because your
              ML recommendation model was trained on these exact categories —
              free text here could produce inaccurate predictions.
            </p>

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;

const GENDER_OPTIONS = ["male", "female"];

const GOAL_OPTIONS = [
  "fat loss",
  "muscle gain",
  "maintenance",
  "recomposition",
  "endurance",
];

const ACTIVITY_OPTIONS = [
  "sedentary",
  "lightly active",
  "moderately active",
  "very active",
  "extremely active",
];

const WORKOUT_TYPE_OPTIONS = [
  "strength",
  "cardio",
  "hiit",
  "hybrid",
  "yoga",
  "mixed",
];

function Profile() {
  const [sidebarProfile, setSidebarProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text }

  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goalWeight: "",
    goal: "",
    activity: "",
    workoutDays: "",
    workoutType: "",
    duration: "",
    diet: "",
    conditions: "",
    sleep: "",
    water: "",
  });

  const fetchProfile = async () => {
    try {
      const [profileData, dashboardData] = await Promise.all([
        getProfile(),
        getDashboard().catch(() => null),
      ]);

      if (profileData?.profile) {
        setProfile({
          age: profileData.profile.age ?? "",
          gender: profileData.profile.gender ?? "",
          height: profileData.profile.height ?? "",
          weight: profileData.profile.weight ?? "",
          goalWeight: profileData.profile.goalWeight ?? "",
          goal: profileData.profile.goal ?? "",
          activity: profileData.profile.activity ?? "",
          workoutDays: profileData.profile.workoutDays ?? "",
          workoutType: profileData.profile.workoutType ?? "",
          duration: profileData.profile.duration ?? "",
          diet: profileData.profile.diet ?? "",
          conditions: profileData.profile.conditions ?? "",
          sleep: profileData.profile.sleep ?? "",
          water: profileData.profile.water ?? "",
        });
      }

      if (dashboardData?.profile) {
        setSidebarProfile(dashboardData.profile);
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    const payload = {
      age: profile.age === "" ? null : parseInt(profile.age, 10),
      gender: profile.gender || "",
      height: profile.height === "" ? null : parseFloat(profile.height),
      weight: profile.weight === "" ? null : parseFloat(profile.weight),
      goalWeight: profile.goalWeight === "" ? null : parseFloat(profile.goalWeight),
      goal: profile.goal || "",
      activity: profile.activity || "",
      workoutDays: profile.workoutDays === "" ? null : parseInt(profile.workoutDays, 10),
      workoutType: profile.workoutType || "",
      duration: profile.duration === "" ? null : parseInt(profile.duration, 10),
      diet: profile.diet || "",
      conditions: profile.conditions || "",
      sleep: profile.sleep === "" ? null : parseFloat(profile.sleep),
      water: profile.water === "" ? null : parseFloat(profile.water),
    };

    setSaving(true);

    try {
      await saveProfile(payload);
      setStatusMsg({ type: "success", text: "Profile saved successfully." });
      await fetchProfile();
    } catch (error) {
      console.error("Profile save failed:", error);
      console.log("Backend error response:", error?.response?.data);
      setStatusMsg({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Failed to save profile. Please check your details and try again.",
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
            <h2>Loading your profile...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout profile={sidebarProfile}>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Your Profile</h1>
          <p>
            These details power your Gemini-generated plans and your ML-based
            calorie &amp; workout intensity predictions — the more accurate,
            the better your recommendations.
          </p>
        </div>
      </div>

      <div className="profile-card">
        <div className="panel-body">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Profile Information</h3>
              <p className="panel-subtitle">
                Update your body stats, goals, and preferences at any time.
              </p>
            </div>
          </div>

          {statusMsg && (
            <div className={`inline-alert ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <p className="sub-heading">Body stats</p>
            <div className="form-grid-3 mb-3">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange} required>
                  <option value="" disabled>Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleChange}
                  placeholder="e.g. 178"
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={profile.weight}
                  onChange={handleChange}
                  placeholder="e.g. 82"
                  required
                />
              </div>

              <div className="form-group">
                <label>Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="goalWeight"
                  value={profile.goalWeight}
                  onChange={handleChange}
                  placeholder="e.g. 75"
                />
              </div>

              <div className="form-group">
                <label>Goal</label>
                <select name="goal" value={profile.goal} onChange={handleChange} required>
                  <option value="" disabled>Select goal</option>
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="sub-heading">Training &amp; lifestyle</p>
            <div className="form-grid-3 mb-3">
              <div className="form-group">
                <label>Activity Level</label>
                <select name="activity" value={profile.activity} onChange={handleChange} required>
                  <option value="" disabled>Select activity level</option>
                  {ACTIVITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Workout Days / Week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  name="workoutDays"
                  value={profile.workoutDays}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                />
              </div>

              <div className="form-group">
                <label>Workout Type</label>
                <select name="workoutType" value={profile.workoutType} onChange={handleChange}>
                  <option value="" disabled>Select workout type</option>
                  {WORKOUT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Session Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={profile.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                />
              </div>

              <div className="form-group">
                <label>Sleep (hours/night)</label>
                <input
                  type="number"
                  step="0.1"
                  name="sleep"
                  value={profile.sleep}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                />
              </div>

              <div className="form-group">
                <label>Water Intake (liters/day)</label>
                <input
                  type="number"
                  step="0.1"
                  name="water"
                  value={profile.water}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                />
              </div>
            </div>

            <p className="sub-heading">Diet &amp; health notes</p>
            <div className="form-grid mb-3">
              <div className="form-group">
                <label>Diet Preference</label>
                <input
                  type="text"
                  name="diet"
                  value={profile.diet}
                  onChange={handleChange}
                  placeholder="e.g. balanced, vegetarian, keto, high-protein"
                />
              </div>

              <div className="form-group">
                <label>Medical Conditions</label>
                <input
                  type="text"
                  name="conditions"
                  value={profile.conditions}
                  onChange={handleChange}
                  placeholder="e.g. none, knee injury, asthma"
                />
              </div>
            </div>

            <p className="helper-text mb-2">
              Gender, goal, and activity level use fixed options because your
              ML recommendation model was trained on these exact categories —
              free text here could produce inaccurate predictions.
            </p>

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
