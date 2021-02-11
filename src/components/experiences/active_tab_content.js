import React from 'react';
import PropTypes from 'prop-types';

const ActiveTabContent = ({ content: { title, subtitle, content } }) => {
  return (
    <div>
      <div className="animated fadeIn">
        <h4 className="title is-4 animated fadeIn">{title}</h4>
        <h5 className="subtitle is-5">{subtitle}</h5>
        {content.items.map((item, index) => (
          <p key={index} className="is-size-4-desktop">
            -{item}
          </p>
        ))}
      </div>
    </div>
  );
};

ActiveTabContent.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    content: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.string) }),
  }),
};

ActiveTabContent.defaultProps = {
  content: {
    title: '',
    subtitle: '',
    content: {
      items: [],
    },
  },
};

export default ActiveTabContent;
