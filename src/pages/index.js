import React, { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Intro from '../components/intro';
import About from '../components/about/about';
import Experiences from '../components/experiences/experiences';
import Projects from '../components/projects/projects';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { spyScrolling } from '../helperFunctions';
import { graphql } from 'gatsby';

const IndexPage = ({ data }) => {
  const {
    graphCmsGregmurrayHome: {
      introLead,
      introSubtitle,
      introCta,
      aboutTitle,
      aboutContent,
      aboutImage,
      technologyTitle,
      technologyContent,
      experiencesTitle,
      experiencesContent,
      featuredTitle,
      featuredContent,
      otherTitle,
      otherContent,
      githubUrl,
      linkedInUrl,
      emailAddress,
      copyrightYear,
    },
  } = data;
  useEffect(() => {
    spyScrolling();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Jacksonville, FL Computing Student</title>
      </Helmet>
      <Intro lead={introLead} subtitle={introSubtitle} cta={introCta} />
      <Navigation />
      <About
        aboutTitle={aboutTitle}
        aboutContent={aboutContent}
        aboutImage={aboutImage}
        technologyTitle={technologyTitle}
        technologyContent={technologyContent}
      />
      <Experiences title={experiencesTitle} content={experiencesContent} />
      <Projects
        featuredTitle={featuredTitle}
        featuredContent={featuredContent}
        otherTitle={otherTitle}
        otherContent={otherContent}
      />
      <Footer
        githubUrl={githubUrl}
        linkedInUrl={linkedInUrl}
        emailAddress={emailAddress}
        copyrightYear={copyrightYear}
      />
    </Fragment>
  );
};

export const pageQuery = graphql`
  query getPageContent {
    graphCmsGregmurrayHome {
      introLead
      introSubtitle
      introCta
      aboutTitle
      aboutContent
      aboutImage {
        localFile {
          childImageSharp {
            fluid(quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      technologyTitle
      technologyContent
      experiencesTitle
      experiencesContent {
        employer
        title
        subtitle
        content
      }
      featuredTitle
      featuredContent {
        title
        titleUrl
        content
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
      otherTitle
      otherContent {
        title
        content
        repositoryUrl
        websiteUrl
        techTags
      }
      githubUrl
      linkedInUrl
      emailAddress
      copyrightYear
    }
  }
`;

export default IndexPage;
