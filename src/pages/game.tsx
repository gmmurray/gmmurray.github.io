import '../game/gameStyles.scss';

import { Link, graphql } from 'gatsby';
import React, { FC, Suspense } from 'react';

import { GameCmsContent } from '../game/types/cmsContent';
import { lazy } from '@loadable/component';

const GameApp = lazy(() => import('../game/GameApp'));

type GamePageProps = {
  data: Record<'graphCmsGregmurrayHome', GameCmsContent>;
};

const GamePage: FC<GamePageProps> = ({ data }) => {
  const isSSR = typeof window === 'undefined';
  return (
    <div className="game-page">
      <div className="game-page__container">
        <div className="game-page__back-button">
          {/* @ts-ignore */}
          <Link to="/">Back</Link>
        </div>
        {!isSSR && (
          <Suspense
            fallback={
              <div className="game-fallback">
                <div>
                  <progress
                    className="progress is-small is-secondary"
                    max={100}
                  ></progress>
                </div>
              </div>
            }
          >
            <GameApp cmsContent={data.graphCmsGregmurrayHome} />
          </Suspense>
        )}
      </div>
      <div className="game-page__small-viewport">
        <div className="subtitle is-2">
          This game is best experienced on larger screens and is not available
          for your current screen size.
        </div>
        <div>
          {/* @ts-ignore */}
          <Link className="button is-link font-dark-blue" to="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const pageQuery = graphql`
  query getCmsContent {
    graphCmsGregmurrayHome {
      aboutContent
      technologyContent
      technologyTree
      experiencesContent {
        employer
        title
        subtitle
        content
        startDate
        endDate
        isActive
      }
      featuredContent {
        title
        titleUrl
        content
        createdAt
        image {
          localFile {
            childImageSharp {
              fluid(quality: 75) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        techTags
        iconName
        iconColor
      }
      otherContent {
        title
        content
        repositoryUrl
        websiteUrl
        techTags
        createdAt
        iconName
        iconColor
      }
      githubUrl
      linkedInUrl
      emailAddress
      copyrightYear
    }
  }
`;

export default GamePage;
