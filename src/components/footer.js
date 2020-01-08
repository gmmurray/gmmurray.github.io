import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithubSquare} from '@fortawesome/free-brands-svg-icons';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons';

export default () => (
    <footer className="footer">
        <div className="content has-text-centered">
            <div className="columns">
                <div className="column"></div>
                <div className="column">
                    <a className="title is-1 font-dark-blue grouped-button-margin" href="https://www.github.com/gmmurray" target="_blank"><FontAwesomeIcon icon={faGithubSquare} /></a>
                    <a className="title is-1 font-dark-blue grouped-button-margin" href="https://www.linkedin.com/in/greg-murray-848423186" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
                </div>
                <div className="column"></div>
            </div>
            <h5 className="title is-6 font-dark-blue">Copyright© Greg Murray 2020</h5>
        </div>
    </footer>
)