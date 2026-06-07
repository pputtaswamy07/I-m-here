import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { MARK_AVAILABLE } from "../../auth/graphql/mutations";
import LocationAutocomplete from "../../location/components/LocationAutocomplete";
import _PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// Vite CJS→ESM interop: the default export may be wrapped in { default: Component }
const PhoneInput = _PhoneInput.default ?? _PhoneInput;
import "../../location/styles/location.css";
import "../../dashboard/styles/dashboard.css";

const taskOptions = [
  "Groceries",
  "Medicine Pickup",
  "Transportation",
  "Companion Visit",
];

function AvailabilityBox() {
  const [location, setLocation] = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(false);

  const [markAvailable] = useMutation(MARK_AVAILABLE);

  const handleTaskChange = (task) => {
    setTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
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
          location,
          phone: phone ? `+${phone}` : undefined,
          email: email.trim() || undefined,
        },
        refetchQueries: ["GetAvailabilities"],
      });

      alert("You are now available ❤️");
      setLocation("");
      setPhone("");
      setEmail("");
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

      {/* Location — autocomplete API */}
      <div className="avail-field-group">
        <label className="avail-label">Your location</label>
        <LocationAutocomplete
          value={location}
          onChange={(val) => setLocation(val)}
        />
      </div>

      {/* Phone number — all countries via react-phone-input-2 */}
      <div className="avail-field-group">
        <label className="avail-label">Phone number</label>
        <PhoneInput
          country="us"
          value={phone}
          onChange={(val) => setPhone(val)}
          enableSearch
          searchPlaceholder="Search country..."
          inputClass="rpi-input"
          containerClass="rpi-container"
          buttonClass="rpi-button"
          dropdownClass="rpi-dropdown"
        />
      </div>

      {/* Contact email */}
      <div className="avail-field-group">
        <label className="avail-label">Contact email</label>
        <input
          type="email"
          className="avail-email-input"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Task checkboxes */}
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

      <button onClick={handleAvailability} disabled={loading}>
        {loading ? "Setting up..." : "I'm Available ❤️"}
      </button>
    </div>
  );
}

export default AvailabilityBox;
