import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { MARK_AVAILABLE } from "../graphql/mutations";
import "../styles/dashboard.css";

function AvailabilityBox() {
  const [location, setLocation] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [markAvailable] = useMutation(MARK_AVAILABLE);

  const taskOptions = [
    "Groceries",
    "Medicine Pickup",
    "Transportation",
    "Companion Visit"
  ];

  const handleTaskChange = (task) => {
    if (tasks.includes(task)) {
      setTasks(tasks.filter((t) => t !== task));
    } else {
      setTasks([...tasks, task]);
    }
  };

  const handleAvailability = async () => {
    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }

    if (tasks.length === 0) {
      alert("Please select at least one service");
      return;
    }

    setLoading(true);

    try {
      await markAvailable({
        variables: {
          tasks,
          location
        },
        refetchQueries: ["GetAvailabilities"]
      });

      alert("You are now available ❤️");
      
      // Reset form
      setLocation("");
      setTasks([]);

    } catch (error) {
      alert(error.message || "Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="availability-box">
      <h2>What can you help with today?</h2>

      <input
        type="text"
        placeholder="Your location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <div className="task-options">
        {taskOptions.map((task) => (
          <label key={task}>
            <input
              type="checkbox"
              checked={tasks.includes(task)}
              onChange={() => handleTaskChange(task)}
            />
            <span>{task}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleAvailability}
        disabled={loading}
      >
        {loading ? "Setting up..." : "I'm Available ❤️"}
      </button>
    </div>
  );
}

export default AvailabilityBox;