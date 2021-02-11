import React from 'react';
import PropTypes from 'prop-types';

const MinorProject = ({
  title,
  tags,
  description,
  repositoryUrl,
  websiteUrl,
}) => {
  return (
    <div className="column is-one-third animated fadeIn">
      <div className="card card-equal-height">
        <header className="card-header">
          <div className="card-header-title">
            <h4 className="title is-4">{title}</h4>
          </div>
        </header>
        <div className="card-content">
          <div className="tags">
            {tags.map((value, index) => {
              return (
                <span className="tag is-link font-dark-blue" key={index}>
                  {value}
                </span>
              );
            })}
          </div>
          <div className="content">{description}</div>
        </div>
        <footer className="card-footer">
          {repositoryUrl && (
            <a
              href={repositoryUrl}
              className="card-footer-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </a>
          )}
          {websiteUrl && (
            <a
              href={websiteUrl}
              className="card-footer-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};

MinorProject.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  repositoryUrl: PropTypes.string,
  websiteUrl: PropTypes.string,
  tags: PropTypes.array.isRequired,
};

MinorProject.defaultProps = {
  repositoryUrl: null,
  websiteUrl: null,
};

export default MinorProject;
