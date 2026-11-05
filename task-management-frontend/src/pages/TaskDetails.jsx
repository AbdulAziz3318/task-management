
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/tasks/${id}`);

        // Supports either { task: {...} } or a direct task object.
        setTask(data.task || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/tasks/${id}`, {
        method: "DELETE"
      });

      alert("Task deleted successfully!");
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="details-page">Loading task...</div>;
  }

  if (error) {
    return (
      <div className="details-page">
        <p className="error">{error}</p>
        <Link to="/tasks">Back to Dashboard</Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="details-page">
        <p>Task not found.</p>
        <Link to="/tasks">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-card">
        <h1>{task.title}</h1>

        <p className="details-description">
          {task.description}
        </p>

        <p>
          <strong>Status: </strong>
          <span className={`status ${task.status}`}>
            {task.status}
          </span>
        </p>

        <div className="details-actions">
          <Link to={`/tasks/${id}/edit`} className="edit-button">
            Edit Task
          </Link>

          <button onClick={handleDelete} className="delete-button">
            Delete Task
          </button>

          <Link to="/tasks" className="back-link">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
