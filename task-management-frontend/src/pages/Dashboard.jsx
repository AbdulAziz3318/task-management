
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/tasks");

      // Supports either an array response or { tasks: [...] }
      const taskList = Array.isArray(data) ? data : data.tasks;

      if (!Array.isArray(taskList)) {
        throw new Error("Unexpected response from the server");
      }

      setTasks(taskList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>My Tasks</h1>
          <p>Manage and track your daily work.</p>
        </div>

        <Link to="/tasks/new" className="add-button">
          + Create Task
        </Link>
      </header>

      <section className="stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{inProgress}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </div>
      </section>

      <section className="task-section">
        <h2>All Tasks</h2>

        {loading && <p>Loading tasks...</p>}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={fetchTasks}>Try Again</button>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="empty-state">
            <h3>No tasks available</h3>
            <p>Create your first task to get started.</p>
            <Link to="/tasks/new">Create Your First Task</Link>
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span className={`status ${task.status}`}>
                    {task.status}
                  </span>
                </div>

                <Link to={`/tasks/${task._id}`}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
