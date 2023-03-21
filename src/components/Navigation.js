import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navigation = () => {
  const [showNavbar, setShowNavbar] = useState(true); // State to show or hide the navigation bar
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle or not the mobile menu
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to keep track of window width
  const [userData, setUserData] = useState([]); // State to store user data
  const [cookieData, setCookiData] = useState(Cookies.get('userData')); // State to store user data from cookies
  
  // Effect hook to update the user data from cookies when the component mounts
  useEffect (() => {
    if (cookieData) {
    setUserData(JSON.parse(Cookies.get('userData')))};
  }, [])

  // Effect hook to add and remove the event listener for the scroll event when the component mounts and unmounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect hook to add and remove the resize event listener when the component is mounted and unmounted
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // function to handle scrolling event and hide or not the navbar
  function handleScroll() {
    const scrollY = window.scrollY;
    const threshold = 120;
    if (scrollY > threshold) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }

  // function to handle the resize fo the window witdth and update the corresponding state
  function handleResize() {
    setWindowWidth(window.innerWidth);
  }

  // Function to handle the mobile menu toggle
  function handleToggle() {
    setMenuOpen(!menuOpen);
  }


  return (
    <nav className={`navbar ${showNavbar ? 'show' : 'hide'}`}>
      <NavLink to="/" className="logo">
        <h1>Quai Antique</h1>
      </NavLink>
      {windowWidth > 899 && 
      <ul>
        <NavLink
          to="/menu"
          className={(nav) => (nav.isActive ? "nav-active hover navlink" : "hover navlink")}>
          <li>La carte</li>
        </NavLink>
        <NavLink
          to="/galerie"
          className={(nav) => (nav.isActive ? "nav-active hover navlink" : "hover navlink")}>
          <li>Galerie</li>
        </NavLink>
        <NavLink
          to="/reserver"
          className={(nav) => (nav.isActive ? "nav-active hover navlink" : "hover navlink")}>
          <li>Réserver</li>
        </NavLink>
       { !userData.email && <NavLink
          to="/se-connecter"
          className={(nav) => (nav.isActive ? "nav-active hover navlink log-in" : "hover navlink")}>
          <li>Se connecter / S'inscrire</li>
        </NavLink>}
        { userData.email && <NavLink
          to="/profil"
          className={(nav) => (nav.isActive ? "nav-active hover navlink log-in" : "hover navlink")}>
          <li>Mon profil</li>
        </NavLink>}
        </ul>
      }

      {windowWidth < 900 && (
        <button className='toggle-btn' onClick={handleToggle}>
          {menuOpen ? <i class="fa-solid fa-xmark"></i> : <i class="fa-solid fa-bars"></i>}
        </button>
        )}
        
      {windowWidth < 900 && menuOpen && (
        <ul className="dropdown-menu">
         <NavLink
          to="/menu"
          className="dropdown-link">
          <li>La carte</li>
        </NavLink>
        <NavLink
          to="/galerie"
          className="dropdown-link">
          <li>Galerie</li>
        </NavLink>
        <NavLink
          to="/reserver"
          className="dropdown-link">
          <li>Réserver</li>
        </NavLink>
        {!userData.email && <NavLink
          to="/se-connecter"
          className="dropdown-link">
          <li>Se connecter / S'inscrire</li>
        </NavLink>}
        {userData.email && <NavLink
          to="/profil"
          className="dropdown-link">
          <li>Mon profil</li>
        </NavLink>}
        </ul>
      )}
    </nav>
  );
};

export default Navigation;