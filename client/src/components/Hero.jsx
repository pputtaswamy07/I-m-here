import "../styles/hero.css";
import hero from "../assets/hero.png";
import { MARK_AVAILABLE } from "../graphql/mutations";
import { useMutation } from "@apollo/client/react";

function Hero() {

  const [markAvailable] = useMutation(MARK_AVAILABLE);

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

          <button className="hero-button" onClick={async () => {

            try {

              await markAvailable({

                variables: {
                  tasks: ["groceries"],
                  location: "Bamberg"
                },

                refetchQueries: ["GetAvailabilities"]
              });

              alert("You are now available!");

            } catch (error) {

              console.log(error);

              alert(error.message);
            }
          }}>
            I'm here ↗
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;