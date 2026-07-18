import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ profile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">P</div>
          <div className="sidebar-brand-text">
            <h2>PeakPilot</h2>
            <span>Fitness Command Center</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-group-title">Overview</p>
            <NavLink to="/" className={navLinkClass}>
              Dashboard
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-group-title">Nutrition</p>
            <NavLink to="/meal" className={navLinkClass}>
              Meal Plan
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-group-title">Training</p>
            <NavLink to="/workout" className={navLinkClass}>
              Workout Plan
            </NavLink>
            <NavLink to="/progress" className={navLinkClass}>
              Progress
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-group-title">AI Insights</p>
            <NavLink to="/model-performance" className={navLinkClass}>
              Model Performance
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-group-title">Account</p>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="avatar">
            {(profile?.first_name?.[0] || "U").toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <p>{profile?.first_name || "User"}</p>
            <span>{profile?.goal || "Fitness Goal"}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;