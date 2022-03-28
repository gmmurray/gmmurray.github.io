import React, { FC, Suspense, useEffect } from 'react';

import { GameCmsContent } from '../game/types/cmsContent';
import { constructTechTree } from '../game/helpers/constructTechTree';
import { graphql } from 'gatsby';
import { lazy } from '@loadable/component';

const GameApp = lazy(() => import('../game/GameApp'));

// TODO: fallback component

type GamePageProps = {
  data: Record<'graphCmsGregmurrayHome', GameCmsContent>;
};

const GamePage: FC<GamePageProps> = ({ data }) => {
  const isSSR = typeof window === 'undefined';
  return (
    <div className="game-page">
      {!isSSR && (
        <Suspense fallback={<div>loading...</div>}>
          <GameApp cmsContent={data.graphCmsGregmurrayHome} />
        </Suspense>
      )}
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
      }
      otherContent {
        title
        content
        repositoryUrl
        websiteUrl
        techTags
        createdAt
      }
      githubUrl
      linkedInUrl
      emailAddress
      copyrightYear
    }
  }
`;

export default GamePage;
