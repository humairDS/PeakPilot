import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getProfile, saveProfile } from "../services/profile";

function Profile() {
  const [loading, setLoading] = useState(true);

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
    water: ""
  });

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      if (data?.profile) {
        setProfile({
          age: data.profile.age ?? "",
          gender: data.profile.gender ?? "",
          height: data.profile.height ?? "",
          weight: data.profile.weight ?? "",
          goalWeight: data.profile.goalWeight ?? "",
          goal: data.profile.goal ?? "",
          activity: data.profile.activity ?? "",
          workoutDays: data.profile.workoutDays ?? "",
          workoutType: data.profile.workoutType ?? "",
          duration: data.profile.duration ?? "",
          diet: data.profile.diet ?? "",
          conditions: data.profile.conditions ?? "",
          sleep: data.profile.sleep ?? "",
          water: data.profile.water ?? ""
        });
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

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await saveProfile(profile);
      alert("Profile saved successfully");
    } catch (error) {
      console.error("Profile save failed:", error);
      console.log("Backend error response:", error?.response?.data);
      alert("Failed to save profile");
    }
  };

  if (loading) {
    return (
      <Layout>
        <h1>Loading profile...</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your health, workout and nutrition preferences.</p>
      </div>

      <div className="card">
        <h3 className="mb-2">Profile Information</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid-2 mb-2">
            <div>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Gender</label>
              <input
                type="text"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Goal Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="goalWeight"
                value={profile.goalWeight}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Goal</label>
              <input
                type="text"
                name="goal"
                value={profile.goal}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Activity Level</label>
              <input
                type="text"
                name="activity"
                value={profile.activity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Workout Days</label>
              <input
                type="number"
                name="workoutDays"
                value={profile.workoutDays}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Workout Type</label>
              <input
                type="text"
                name="workoutType"
                value={profile.workoutType}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Workout Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={profile.duration}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Diet Preference</label>
              <input
                type="text"
                name="diet"
                value={profile.diet}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Medical Conditions</label>
              <input
                type="text"
                name="conditions"
                value={profile.conditions}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Sleep (hours)</label>
              <input
                type="number"
                step="0.1"
                name="sleep"
                value={profile.sleep}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Water Intake (liters)</label>
              <input
                type="number"
                step="0.1"
                name="water"
                value={profile.water}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Profile;