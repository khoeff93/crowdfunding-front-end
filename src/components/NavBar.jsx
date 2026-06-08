import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import './NavBar.css';
import logo from '../assets/uncomfortably_green_logo.svg';
import hamburger from '../assets/hamburger.svg';

function NavBar() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Is the mobile hamburger menu open? (starts closed)
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    window.localStorage.clear();
    setAuth({ token: null, userId: null, username: null, email: null });
    navigate("/");
  };

  // When you click Home while already on the homepage, scroll back to the top
  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMenuOpen(false); // close the mobile menu after clicking
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
    setMenuOpen(false); // close the mobile menu after clicking
  };

  return (
    <div>
      {/* Add the "open" class when the mobile menu is showing */}
      <nav className={menuOpen ? "open" : ""}>
        <div className="nav-logo">
          <Link to="/"><img src={logo} alt="logo" /></Link>
        </div>

        {/* Hamburger button - only shows on mobile (see NavBar.css) */}
        <button
          className="hamburger-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src={hamburger} alt="Menu" />
        </button>

        <ul className="nav-links">
          <li><Link to="/" onClick={handleHomeClick}>Home</Link></li>
          <li><a href="#about" onClick={(e) => handleScrollClick(e, "#about")}>About Us</a></li>
          <li><a href="#contact" onClick={(e) => handleScrollClick(e, "#contact")}>Contact Us</a></li>
          <li><Link to="/donation" onClick={() => setMenuOpen(false)}>Donate</Link></li>
        </ul>
        <div className="nav-buttons">
          {auth.token ? (
            <>
              <Link to="/create-fundraiser" onClick={() => setMenuOpen(false)}>
                <button className="btn-create">Create Fundraiser</button>
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <button className="btn-create">My Profile</button>
              </Link>
              <button className="btn-create" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}><button>Login</button></Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}><button className="btn-create">Create a Fundraiser</button></Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;
