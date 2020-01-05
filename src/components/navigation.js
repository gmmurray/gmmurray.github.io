import React, { Component, Fragment } from 'react';
import logo from '../images/icons/personal_logo_resize.png';

class Navigation extends Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
          scrollLock: false  
        };
        this.handleScroll = this.handleScroll.bind(this);
    }
    
    componentDidMount() {
        this.navbar = document.getElementById("navigation");
        this.offset = this.navbar.offsetTop;
        window.addEventListener('scroll', this.handleScroll, true);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.pageYOffset >= this.offset) {
            this.setState({
                scrollLock: true
            });
        } else {
            this.setState({
                scrollLock: false
            });
        }
    }

    render() {
        return (
            <Fragment>
                <nav className={`navbar is-transparent ${this.state.scrollLock ? "sticky" : ""}`} role="navigation" aria-label="mainNavigation" id="navigation">
                    <div className="container">
                        <div className="navbar-brand">
                            <a className="navbar-item" href="#intro">
                                <img src={logo} alt="Logo" />
                            </a>

                            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu">
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
                        </div>

                        <div id="navbarMenu" className="navbar-menu">
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
            </Fragment>
        )
    }


}

export default Navigation