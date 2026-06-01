import "../styles/hero.css";
import hero from "../../../assets/hero.png";

function Hero() {

 
  return (
    <section className="hero">
      <img src={hero} alt="hero" className="hero-image" />

      <div className="hero-overlay">
        <div className="hero-content">
          <h1>
            Neighborly Help,
            <br />
            Right Here.
          </h1>
          <p>
            Connect with local volunteers ready to help
            with groceries, medicine, or simply a chat.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;