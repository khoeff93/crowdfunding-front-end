import { Link, Outlet } from "react-router-dom";
import './NavBar.css';
import logo from '../assets/uncomfortably_green_logo.svg';

function NavBar() {
  return (
    <div>
      <nav>
    <div className="nav-logo">
        <Link to="/"><img src={logo} alt="logo" /></Link>
    </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Sign Up</button></Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;