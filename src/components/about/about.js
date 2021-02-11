import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

const About = ({
  aboutTitle,
  aboutContent,
  aboutImage,
  technologyTitle,
  technologyContent,
}) => (
  <section className="container section" id="about">
    <div className="columns">
      <div className="column is-one-third">
        {aboutImage && (
          <figure className="image container">
            <Img
              fluid={aboutImage.localFile.childImageSharp.fluid}
              alt="Greg Murray Logo"
            />
          </figure>
        )}
      </div>
      <div className="column">
        <h2 className="title is-2">{aboutTitle}</h2>
        <p className="is-size-4-desktop">{aboutContent}</p>
        <h4 className="title is-4 padded-header">{technologyTitle}</h4>
        <div className="columns is-multiline">
          {technologyContent.items.map((value, index) => {
            return (
              <div className="column is-half" key={index}>
                -{value}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

About.propTypes = {
  aboutTitle: PropTypes.string,
  aboutContent: PropTypes.string,
  aboutImage: PropTypes.shape({
    localFile: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.object,
      }),
    }),
  }),
  technologyTitle: PropTypes.string,
  technologyContent: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.string),
  }),
};

About.defaultProps = {
  aboutTitle: '',
  aboutContent: '',
  aboutImage: null,
  technologyTitle: '',
  technologyContent: {
    items: [],
  },
};

export default About;
