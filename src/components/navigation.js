import React, { useCallback, useEffect, useState } from 'react';
import logo from '../images/icons/personal_logo_resize.png';

const Navigation = () => {
  const [scrollLock, setScrollLock] = useState(false);
  const [navbarOpened, setNavBarOpened] = useState(false);

  useEffect(() => {
    const watchScroll = () => {
      const offset = document.getElementById('navigation').offsetTop;
      window.addEventListener('scroll', () => handleScroll(offset), true);
    };

    watchScroll();
  }, []); // eslint-disable-line

  const handleScroll = useCallback(
    offset => {
      setScrollLock(window.pageYOffset >= offset);
    },
    [setScrollLock],
  );

  const toggleMenu = useCallback(() => {
    const newNavbarOpenedState = !navbarOpened;
    setNavBarOpened(newNavbarOpenedState);
  }, [navbarOpened, setNavBarOpened]);

  const navbar_cn = `navbar ${scrollLock ? 'sticky' : ''}`;
  const navbarToggle_cn = `navbar-burger ${navbarOpened ? 'is-active' : ''}`;
  const navbarMenu_cn = `navbar-menu ${navbarOpened ? 'is-active' : ''}`;
  return (
    <nav
      className={navbar_cn}
      role="navigation"
      aria-label="mainNavigation"
      id="navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="#intro">
            <img src={logo} alt="Logo" />
          </a>

          {/* eslint-disable-next-line */}
          <a
            role="button"
            className={navbarToggle_cn}
            aria-label="menu"
            aria-expanded="false"
            onClick={toggleMenu}
            id="navbarToggler"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarMenu" className={navbarMenu_cn}>
          <div className="navbar-end">
            <a className="navbar-item" href="#about">
              About
            </a>
            <a className="navbar-item" href="#experiences">
              Experiences
            </a>
            <a className="navbar-item" href="#projects">
              Projects
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
