
import "../styles/volunteersection.css";

function VolunteerCard({ volunteer }) {
  return (
    <div className="volunteer-card">
      <div className="volunteer-avatar"></div>

      <div className="volunteer-info">
        <h3 className="volunteer-name">{volunteer.user.name}</h3>

        <p className="volunteer-phone">{volunteer.user.phone}</p>

        <div className="volunteer-services-section">
          <p className="services-label">Services</p>
          <div className="services-tags">
            {volunteer.tasks.map((task, index) => (
              <span key={index} className="service-tag">
                {task}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerCard;