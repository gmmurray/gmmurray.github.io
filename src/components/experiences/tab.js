import React from 'react';
import PropTypes from 'prop-types';
const Tab = ({ name, active, changeActiveName }) => {
  const item_CN = active ? 'is-active has-font-weight-bold' : '';
  return (
    <li className={item_CN}>
      <a onClick={() => changeActiveName(name)}>
        <span>{name}</span>
      </a>
    </li>
  );
};

Tab.propTypes = {
  name: PropTypes.string,
  active: PropTypes.bool,
  changeActiveName: PropTypes.func.isRequired,
};

Tab.defaultProps = {
  name: '',
  active: false,
};

export default Tab;
