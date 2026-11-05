
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function TaskForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditing) return;

    const fetchTask = async () => {
      try {
        setLoading(true);

        const data = await apiRequest(`/tasks/${id}`);
        const task = data.task || data;

        setTitle(task.title || "");
        setDescription(task.description || "");
        setStatus(task.status || "pending");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter both title and description");
      return;
    }

    try {
      setSaving(true);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status
      };

      if (isEditing) {
        await apiRequest(`/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify(taskData)
        });

        alert("Task updated successfully!");
      } else {
        await apiRequest("/tasks", {
          method: "POST",
          body: JSON.stringify(taskData)
        });

        alert("Task created successfully!");
      }

      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="form-page">Loading task...</div>;
  }

  return (
    <div className="form-page">
      <form className="task-form" onSubmit={handleSubmit}>
        <h1>{isEditing ? "Edit Task" : "Create New Task"}</h1>

        <p>
          {isEditing
            ? "Update your task details."
            : "Add a new task to your task manager."}
        </p>

        {error && <p className="error">{error}</p>}

        <label>Task Title</label>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />

        <label>Description</label>
        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows="5"
        />

        <label>Task Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : isEditing
            ? "Update Task"
            : "Create Task"}
        </button>

        <Link to="/tasks" className="back-link">
          Back to Dashboard
        </Link>
      </form>
    </div>
  );
}

export default TaskForm;
