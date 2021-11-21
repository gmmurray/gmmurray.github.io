import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import MinorProject from './minor_project';

const PROJECTS_PER_PAGE = 3;

const OtherProjects = ({ projects }) => {
  const [currentProjectCount, setCurrentProjectCount] = useState(
    PROJECTS_PER_PAGE,
  );

  const handleMoreClick = useCallback(() => {
    const newProjectCount = currentProjectCount + PROJECTS_PER_PAGE;
    setCurrentProjectCount(newProjectCount);
  }, [currentProjectCount, setCurrentProjectCount]);

  const sortedProjects = (projects ?? []).sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1,
  );
  console.log(sortedProjects);
  const visibleProjects = (sortedProjects || []).filter(
    (oc, index) => index < currentProjectCount,
  );
  return (
    <Fragment>
      <div className="columns is-multiline">
        {visibleProjects.map(
          (
            { title, content, repositoryUrl, websiteUrl, techTags: { items } },
            index,
          ) => {
            return (
              <MinorProject
                key={index}
                title={title}
                tags={items}
                description={content}
                repositoryUrl={repositoryUrl}
                websiteUrl={websiteUrl}
              />
            );
          },
        )}
      </div>
      <div className="columns has-text-centered">
        <div className="column"></div>
        <div className="column">
          <button
            disabled={currentProjectCount >= projects.length}
            onClick={handleMoreClick}
            className="button is-link font-dark-blue"
          >
            More
          </button>
        </div>
        <div className="column"></div>
      </div>
    </Fragment>
  );
};

OtherProjects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      repositoryUrl: PropTypes.string,
      websiteUrl: PropTypes.string,
      techTags: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  ),
};

OtherProjects.defaultProps = {
  projects: [
    {
      title: '',
      content: '',
      repositoryUrl: null,
      websiteUrl: null,
      techTags: {
        items: [],
      },
    },
  ],
};

export default OtherProjects;
