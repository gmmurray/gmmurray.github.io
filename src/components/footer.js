import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithubSquare} from '@fortawesome/free-brands-svg-icons';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {faEnvelopeSquare} from '@fortawesome/free-solid-svg-icons';

export default () => (
    <footer className="footer">
        <div className="content has-text-centered">
            <div className="columns">
                <div className="column"></div>
                <div className="column">
                    <a className="title is-1 font-dark-blue grouped-button-margin" href="https://www.github.com/gmmurray" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithubSquare} /></a>
                    <a className="title is-1 font-dark-blue grouped-button-margin" href="https://www.linkedin.com/in/greg-murray-848423186" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
                    <a className="title is-1 font-dark-blue grouped-button-margin" href="mailto:gregorymichaelmurray@gmail.com" ><FontAwesomeIcon icon={faEnvelopeSquare} /></a>
                </div>
                <div className="column"></div>
            </div>
            <h5 className="title is-6 font-dark-blue">Copyright© Greg Murray 2020</h5>
        </div>
    </footer>
)