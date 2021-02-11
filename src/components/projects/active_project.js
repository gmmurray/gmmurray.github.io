import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Img from 'gatsby-image';

const ActiveProject = ({
  title,
  titleUrl,
  description,
  image,
  tags,
  prevClick,
  nextClick,
  prevDisabled,
  nextDisabled,
}) => {
  return (
    <Fragment>
      <div className="columns">
        <div className="column is-half">
          <figure className="image with-primary-border">
            <Img fluid={image} alt={title} />
          </figure>
        </div>
        <div className="column">
          <a
            className="title is-3 is-link"
            href={titleUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="featured-project-title">{title}</h3>
          </a>
          <div className="tags">
            {tags.map((value, index) => {
              return (
                <span className="tag is-link font-dark-blue" key={index}>
                  {value}
                </span>
              );
            })}
          </div>
          <p className="is-size-4-desktop">
            <ReactMarkdown>{description}</ReactMarkdown>
          </p>
        </div>
      </div>
      <div className="columns">
        <div className="column"></div>
        <div className="column has-text-centered">
          <button
            disabled={prevDisabled}
            className="button is-link font-dark-blue grouped-button-margin"
            onClick={prevClick}
          >
            Prev
          </button>
          <button
            disabled={nextDisabled}
            className="button is-link font-dark-blue grouped-button-margin"
            onClick={nextClick}
          >
            Next
          </button>
        </div>
        <div className="column"></div>
      </div>
    </Fragment>
  );
};

ActiveProject.propTypes = {
  title: PropTypes.string.isRequired,
  titleUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.object,
  tags: PropTypes.array.isRequired,
  prevClick: PropTypes.func.isRequired,
  nextClick: PropTypes.func.isRequired,
  prevDisabled: PropTypes.bool.isRequired,
  nextDisabled: PropTypes.bool.isRequired,
};

ActiveProject.defaultProps = {
  image: null,
};

export default ActiveProject;
