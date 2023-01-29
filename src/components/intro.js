import React, { useCallback, useState } from 'react';

import ContactModal from './contactModal/';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import logo from '../images/icons/personal_logo_resize.png';

const Intro = ({
  lead,
  subtitle,
  cta,
  contactModalTitle,
  contactModalNameLabel,
  contactModalEmailLabel,
  contactModalMessageLabel,
  contactModalSubmitText,
  contactModalSuccessTitle,
  contactModalFailureTitle,
  contactModalSuccessText,
  contactModalFailureText,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsOpen(!modalIsOpen);
  }, [modalIsOpen, setModalIsOpen]);

  return (
    <section className="hero is-fullheight section" id="intro">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="columns">
            <div className="column">
              <figure className="image container is-128x128">
                <img src={logo} alt="Greg Murray Logo" />
              </figure>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <h1 className="title is-1">{lead}</h1>
              <h2 className="subtitle is-2">{subtitle}</h2>
              <div className="cta-button-container">
                <button
                  className="button is-link font-dark-blue"
                  onClick={toggleModal}
                >
                  {cta}
                </button>
              </div>
              <div className="cta-button-container">
                <Link className="button is-link font-dark-blue" to="/game">
                  Game
                </Link>
              </div>
              <div className="cta-button-container">
                <a
                  className="button is-link font-dark-blue"
                  href="https://blog.gregmurray.org"
                >
                  Blog
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactModal
        open={modalIsOpen}
        toggleModal={toggleModal}
        title={contactModalTitle}
        nameLabel={contactModalNameLabel}
        emailLabel={contactModalEmailLabel}
        messageLabel={contactModalMessageLabel}
        submitText={contactModalSubmitText}
        successTitle={contactModalSuccessTitle}
        failureTitle={contactModalFailureTitle}
        successText={contactModalSuccessText}
        failureText={contactModalFailureText}
      />
    </section>
  );
};

Intro.propTypes = {
  lead: PropTypes.string,
  subtitle: PropTypes.string,
  cta: PropTypes.string,
  contactModalTitle: PropTypes.string,
  contactModalNameLabel: PropTypes.string,
  contactModalEmailLabel: PropTypes.string,
  contactModalMessageLabel: PropTypes.string,
  contactModalSubmitText: PropTypes.string,
  contactModalSuccessTitle: PropTypes.string,
  contactModalFailureTitle: PropTypes.string,
  contactModalSuccessText: PropTypes.string,
  contactModalFailureText: PropTypes.string,
};

Intro.defaultProps = {
  lead: '',
  subtitle: '',
  cta: '',
  contactModalTitle: '',
  contactModalNameLabel: '',
  contactModalEmailLabel: '',
  contactModalMessageLabel: '',
  contactModalSubmitText: '',
  contactModalSuccessTitle: '',
  contactModalFailureTitle: '',
  contactModalSuccessText: '',
  contactModalFailureText: '',
};

export default Intro;
