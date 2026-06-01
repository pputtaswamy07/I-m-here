import "../styles/navbar.css";
import logo from "../assets/logo.png";
import{Link} from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo } alt="logo" className="logo"/>
        <h2>I'm here</h2>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/join">Join</Link>
        <Link to="/login"> Login </Link>
         <Link to="/"> Logout </Link>
      </div>
    </nav>
  );
}

export default Navbar;