import React, { useEffect, useState } from 'react';

import { OverlayContentKey } from '../types/overlayContent';
import classNames from 'classnames';
import { overlaySelectors } from '../redux/overlaySlice';
import { useSelector } from 'react-redux';

const diplomaContent = {
  [OverlayContentKey.UF]: {
    type: 'Arts',
    school: 'University of Florida',
    degree: 'Anthropology',
    year: '2018',
  },
  [OverlayContentKey.UNF]: {
    type: 'Science',
    school: 'University of North Florida',
    degree: 'Computing and Information Sciences',
    year: '2020',
  },
};

const IMAGE_SRC = '/assets/game/images/paper_scroll.png';

const Diploma = () => {
  const [visible, setVisible] = useState(false);
  const key = useSelector(overlaySelectors.selectOverlayContentKey);
  const { type, school, degree, year } = diplomaContent[key];

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={classNames(
        'diploma-container game-overlay-component-container',
        {
          'diploma-container-visible': visible,
        },
      )}
    >
      <img src={IMAGE_SRC} className="diploma-image" />
      <div className="diploma-content">
        <h1 className="diploma-content-school">{school}</h1>
        <p className="diploma-content-type">Bachelor of {type}</p>
        <p className="diploma-content-degree">{degree}</p>
        <p className="diploma-content-year">{year}</p>
      </div>
    </div>
  );
};

export default Diploma;
