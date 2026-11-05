
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/tasks" className="brand">
        TaskFlow
      </Link>

      <div className="navbar-right">
        <span className="welcome">
          Welcome, {user?.name || "User"}
        </span>

        <Link to="/tasks" className="nav-link">
          Dashboard
        </Link>

        <Link to="/tasks/new" className="nav-link">
          Create Task
        </Link>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
