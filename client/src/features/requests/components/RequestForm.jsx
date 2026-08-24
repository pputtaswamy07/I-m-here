import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { POST_REQUEST } from "../../auth/graphql/mutations";
import LocationAutocomplete from "../../location/components/LocationAutocomplete";
import "../styles/requests.css";

const CATEGORIES = [
  { value: "GROCERY",       label: "Grocery Shopping" },
  { value: "TRANSPORT",     label: "Transportation" },
  { value: "COMPANIONSHIP", label: "Companionship" },
  { value: "ERRANDS",       label: "General Errands" },
  { value: "OTHER",         label: "Other" },
];

function RequestForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "OTHER",
    location: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [postRequest, { loading }] = useMutation(POST_REQUEST, {
    refetchQueries: ["MyRequests"],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location.trim()) {
      setError("Please enter a location.");
      return;
    }
    try {
      await postRequest({ variables: form });
      setForm({ title: "", description: "", category: "OTHER", location: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to post request. Please try again.");
    }
  };

  return (
    <div className="request-form-box">
      <h2>What do you need help with?</h2>

      {submitted && (
        <div className="request-success">
          Your request has been posted — volunteers can now see it.
        </div>
      )}

      {error && <div className="request-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="req-field-group">
          <label className="req-label" htmlFor="req-title">Title</label>
          <input
            id="req-title"
            name="title"
            type="text"
            placeholder="e.g. Help carrying groceries from the store"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="req-field-group">
          <label className="req-label" htmlFor="req-category">Category</label>
          <select
            id="req-category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="req-field-group">
          <label className="req-label">Location</label>
          <LocationAutocomplete
            value={form.location}
            onChange={(val) => { setForm((f) => ({ ...f, location: val })); setError(""); }}
          />
        </div>

        <div className="req-field-group">
          <label className="req-label" htmlFor="req-description">Details <span className="req-optional">(optional)</span></label>
          <textarea
            id="req-description"
            name="description"
            placeholder="Any extra details that would help a volunteer..."
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <button type="submit" className="req-submit-btn" disabled={loading}>
          {loading ? "Posting..." : "Post Request"}
        </button>
      </form>
    </div>
  );
}

export default RequestForm;
