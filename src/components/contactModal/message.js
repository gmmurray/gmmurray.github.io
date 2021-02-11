import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const messageTypes = {
  success: 'success',
  failure: 'failure',
};

const Message = ({ title, message, type }) => {
  const [hide, setHide] = useState(false);
  let colorVariant;
  if (type === messageTypes.success) {
    colorVariant = 'is-success';
  } else if (type === messageTypes.failure) {
    colorVariant = 'is-danger';
  }

  if (!colorVariant || hide) {
    return <></>;
  }

  const article_cn = `message ${colorVariant}`;

  return (
    <article className={article_cn}>
      <div className="message-header">
        <p>{title}</p>
        <button
          className="delete"
          aria-label="delete"
          onClick={() => setHide(true)}
        ></button>
      </div>
      <div className="message-body">{message}</div>
    </article>
  );
};

Message.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(messageTypes)).isRequired,
};

export default Message;
