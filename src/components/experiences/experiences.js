import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Tabs from './tabs';
import ActiveTabContent from './active_tab_content';

const Experiences = ({ title, content }) => {
  const [activeContent, setActiveContent] = useState(content[0]);

  const changeActiveEmployer = useCallback(
    newEmployer => {
      const index = content.findIndex(c => c.employer === newEmployer) || 0;
      setActiveContent(content[index]);
    },
    [content, setActiveContent],
  );

  return (
    <section className="container section" id="experiences">
      <h2 className="title is-2 has-text-centered">{title}</h2>
      <Tabs
        names={content.map(c => c.employer)}
        activeName={activeContent.employer}
        changeActiveName={newEmployer => changeActiveEmployer(newEmployer)}
      />

      <ActiveTabContent
        key={activeContent.employer}
        content={{ ...activeContent }}
      />
    </section>
  );
};

Experiences.propTypes = {
  title: PropTypes.string,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      employer: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      content: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  ),
};

Experiences.defaultProps = {
  title: '',
  content: [
    {
      employer: '',
      title: '',
      subtitle: '',
      content: {
        items: [],
      },
    },
  ],
};

export default Experiences;
