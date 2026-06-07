import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import whyImage from "../../../assets/whywecare.png";
import "../styles/whyWeCare.css";

function WhyWeCare() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`why-section${visible ? " why-section--visible" : ""}`}>
      <div className="why-image-wrap">
        <img src={whyImage} alt="Why we care" className="why-photo" />
      </div>
      <div className="why-content">
        <h2 className="why-heading">Why we care</h2>
        <p className="why-text">
          We believe thriving neighborhoods start with simple acts of kindness.
        </p>
        <button className="why-btn" onClick={() => navigate("/about")}>
          Learn more
        </button>
      </div>
    </section>
  );
}

export default WhyWeCare;
