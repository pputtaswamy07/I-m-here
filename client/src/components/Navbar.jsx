import "../styles/navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo } alt="logo" className="logo" />
        <h2>I'm here</h2>
      </div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Join</a>
        <a href="#">Login</a>
      </div>
    </nav>
  );
}

export default Navbar;