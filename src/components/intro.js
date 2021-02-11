import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import logo from '../images/icons/personal_logo_resize.png';
import ContactModal from './contactModal';

const Intro = ({ lead, subtitle, cta }) => {
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
              <button
                className="button is-link font-dark-blue"
                onClick={toggleModal}
              >
                {cta}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ContactModal open={modalIsOpen} toggleModal={toggleModal} />
    </section>
  );
};

Intro.propTypes = {
  lead: PropTypes.string,
  subtitle: PropTypes.string,
  cta: PropTypes.string,
};

Intro.defaultProps = {
  lead: '',
  subtitle: '',
  cta: '',
};

export default Intro;
