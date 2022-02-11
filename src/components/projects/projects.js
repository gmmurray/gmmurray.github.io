import React, { useCallback, useState } from 'react';

import ActiveProject from './active_project';
import Lightbox from 'react-image-lightbox';
import OtherProjects from './other_projects';
import PropTypes from 'prop-types';

const getImageSrc = content =>
  content?.image?.localFile?.childImageSharp?.fluid?.src ?? undefined;

const FeaturedProjects = ({
  featuredTitle,
  featuredContent,
  otherTitle,
  otherContent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const sortedFeaturedContent = (featuredContent ?? []).sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1,
  );

  const handleActiveProjectChange = useCallback(
    pageChange => {
      const newIndex = currentIndex + pageChange;
      setCurrentIndex(newIndex);
    },
    [currentIndex, setCurrentIndex],
  );

  const handlePrevClick = useCallback(() => handleActiveProjectChange(-1), [
    handleActiveProjectChange,
  ]);
  const handleNextClick = useCallback(() => handleActiveProjectChange(1), [
    handleActiveProjectChange,
  ]);

  const {
    title,
    titleUrl,
    content,
    image: {
      localFile: {
        childImageSharp: { fluid },
      },
    },
    techTags: { items },
  } = sortedFeaturedContent[currentIndex];
  const prevDisabled = currentIndex === 0;
  const nextDisabled =
    currentIndex === sortedFeaturedContent?.length - 1 ?? false;

  const prevImage = prevDisabled
    ? undefined
    : getImageSrc(sortedFeaturedContent[currentIndex - 1]);
  const nextImage = nextDisabled
    ? undefined
    : getImageSrc(sortedFeaturedContent[currentIndex + 1]);

  return (
    <section className="container section" id="projects">
      <h2 className="title is-2">{featuredTitle}</h2>
      <ActiveProject
        key={title}
        title={title}
        titleUrl={titleUrl}
        description={content}
        image={fluid}
        tags={items}
        prevClick={handlePrevClick}
        nextClick={handleNextClick}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        onImageClick={() => setIsLightboxOpen(true)}
      />
      {isLightboxOpen && (
        <Lightbox
          mainSrc={fluid.src}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMoveNextRequest={handleNextClick}
          nextSrc={nextImage}
          onMovePrevRequest={handlePrevClick}
          prevSrc={prevImage}
          imageTitle={title}
        />
      )}
      <h3 className="title is-3">{otherTitle}</h3>
      <OtherProjects projects={otherContent} />
    </section>
  );
};

FeaturedProjects.propTypes = {
  featuredTitle: PropTypes.string,
  featuredContent: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      titleUrl: PropTypes.string,
      content: PropTypes.string,
      image: PropTypes.shape({
        localFile: PropTypes.shape({
          childImageSharp: PropTypes.shape({
            fluid: PropTypes.object,
          }),
        }),
      }),
      techTags: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.string) }),
    }),
  ),
  otherTitle: PropTypes.string,
  otherContent: PropTypes.arrayOf(
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

FeaturedProjects.defaultProps = {
  featuredTitle: '',
  featuredContent: [
    {
      title: '',
      titleUrl: null,
      content: '',
      image: { url: null },
      techTags: {
        items: [],
      },
    },
  ],
  otherTitle: '',
  otherContent: [
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

export default FeaturedProjects;
