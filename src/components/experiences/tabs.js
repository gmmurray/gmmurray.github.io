import React from 'react';
import PropTypes from 'prop-types';
import Tab from './tab';

const Tabs = ({ names, activeName, changeActiveName }) => {
  return (
    <div className="tabs is-centered is-large">
      <ul>
        {names.map(name => (
          <Tab
            name={name}
            key={name}
            active={name === activeName}
            changeActiveName={changeActiveName}
          />
        ))}
      </ul>
    </div>
  );
};

Tabs.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string),
  activeName: PropTypes.string,
  changeActiveName: PropTypes.func.isRequired,
};

Tabs.defaultProps = {
  content: [''],
  activeName: '',
};
export default Tabs;
