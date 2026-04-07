import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import './NavBar.css';
import logo from '../assets/uncomfortably_green_logo.svg';

function NavBar() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    window.localStorage.clear();
    setAuth({ token: null, userId: null, username: null, email: null });
    navigate("/");
  };

  const handleScrollClick = (e, hash) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => navigate(`/${hash}`), 0);
    }
  };

  return (
    <div>
      <nav>
        <div className="nav-logo">
          <Link to="/"><img src={logo} alt="logo" /></Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#about" onClick={(e) => handleScrollClick(e, "#about")}>About Us</a></li>
          <li><a href="#contact" onClick={(e) => handleScrollClick(e, "#contact")}>Contact Us</a></li>
          <li><Link to="/donation">Donate</Link></li>
        </ul>
        <div className="nav-buttons">
          {auth.token ? (
            <>
              <Link to="/create-fundraiser">
                <button className="btn-create">Create Fundraiser</button>
              </Link>
              <Link to="/profile">
                <button className="btn-create">My Profile</button>
              </Link>
              <button className="btn-create" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/signup"><button>Sign Up</button></Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;
