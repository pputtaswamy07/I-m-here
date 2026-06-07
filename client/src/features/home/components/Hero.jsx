import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import hero from "../../../assets/hero.png";
import WhyWeCare from "./WhyWeCare";
import FollowJourney from "./FollowJourney";

function Hero() {
  const navigate = useNavigate();

  return (
    <main className="home-main">

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="hero-heading">volunteer your time</h1>
          <p className="hero-sub">
            support local seniors<br />
            with everyday tasks and companionship.
          </p>
          <button className="pill-btn" onClick={() => navigate("/join")}>
            Get Started
          </button>
        </div>
        <div className="hero-image-wrap">
          <img src={hero} alt="volunteer helping senior" className="hero-photo" />
        </div>
      </section>

      <WhyWeCare />
      <FollowJourney />

    </main>
  );
}

export default Hero;
