import React from 'react';
import logo from '../images/icons/personal_logo_resize.png';

export default () => (
    <section className="container section" id="about">
        <div className="columns">
            <div className="column is-one-third">
                <figure className="image container is-128x128">
                    <img src={logo} alt="Greg Murray Logo" />
                </figure>
            </div>
            <div className="column">
                <h2 className="title is-2">About me</h2>
                <p className="is-size-4-desktop">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                <p className="is-size-4-desktop">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                <h4 className="title is-4">Languages and Technology</h4>
                <p className="is-size-4-desktop">
                    <ul className="skills-list">
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                        <li>Java</li>
                    </ul>
                </p>
            </div>
        </div>
    </section>
)