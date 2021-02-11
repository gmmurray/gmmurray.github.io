import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ githubUrl, linkedInUrl, copyrightYear }) => (
  <footer className="footer">
    <div className="content has-text-centered">
      <div className="columns">
        <div className="column"></div>
        <div className="column">
          <a
            className="title is-1 font-dark-blue grouped-button-margin"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithubSquare} />
          </a>
          <a
            className="title is-1 font-dark-blue grouped-button-margin"
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <div className="column"></div>
      </div>
      <h5 className="title is-6 font-dark-blue">
        Copyright© Greg Murray {copyrightYear}
      </h5>
    </div>
  </footer>
);

Footer.propTypes = {
  githubUrl: PropTypes.string,
  linkedInUrl: PropTypes.string,
  copyrightYear: PropTypes.string,
};

Footer.defaultProps = {
  githubUrl: '',
  linkedInUrl: '',
  copyrightYear: '',
};

export default Footer;
