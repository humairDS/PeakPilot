import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ profile}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>

        <span className="sidebar-logo-name">PeakPilot</span>
      </div>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Dashboard
      </NavLink>

      <div className="nav-section">Nutrition</div>

      <NavLink
        to="/meal"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Meal Plan
      </NavLink>

      <div className="nav-section">Training</div>

      <NavLink
        to="/workout"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Workout Plan
      </NavLink>

      <div className="nav-section">Progress</div>

      <NavLink
        to="/progress"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Weekly Tracker
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Profile
      </NavLink>

      <div className="sidebar-user">
        <div className="avatar">U</div>

        <div className="sidebar-user-info">
          <p>{profile?.first_name || "User"}</p>
          <span>{profile?.goal || "Fitness Goal"}</span>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          ✕
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;