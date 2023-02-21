import React, { Fragment, useEffect } from 'react';

import About from '../components/about/about';
import Experiences from '../components/experiences/experiences';
import Footer from '../components/footer';
import { Helmet } from 'react-helmet';
import Intro from '../components/intro';
import Navigation from '../components/navigation';
import Projects from '../components/projects/projects';
import SEO from '../components/seo';
import { graphql } from 'gatsby';
import { spyScrolling } from '../helpers/spyScrolling';

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
      contactModalTitle,
      contactModalNameLabel,
      contactModalEmailLabel,
      contactModalMessageLabel,
      contactModalSubmitText,
      contactModalSuccessTitle,
      contactModalFailureTitle,
      contactModalSuccessText,
      contactModalFailureText,
    },
  } = data;
  useEffect(() => {
    spyScrolling();
  }, []);

  return (
    <Fragment>
      <SEO />
      <Helmet>
        <meta charSet="utf-8" />
        <title>Jacksonville, FL Software Engineer</title>
      </Helmet>
      <Intro
        lead={introLead}
        subtitle={introSubtitle}
        cta={introCta}
        contactModalTitle={contactModalTitle}
        contactModalNameLabel={contactModalNameLabel}
        contactModalEmailLabel={contactModalEmailLabel}
        contactModalMessageLabel={contactModalMessageLabel}
        contactModalSubmitText={contactModalSubmitText}
        contactModalSuccessTitle={contactModalSuccessTitle}
        contactModalFailureTitle={contactModalFailureTitle}
        contactModalSuccessText={contactModalSuccessText}
        contactModalFailureText={contactModalFailureText}
        linkedInUrl={linkedInUrl}
      />
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
      otherTitle
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
      contactModalTitle
      contactModalNameLabel
      contactModalEmailLabel
      contactModalMessageLabel
      contactModalSubmitText
      contactModalSuccessTitle
      contactModalFailureTitle
      contactModalSuccessText
      contactModalFailureText
    }
  }
`;

export default IndexPage;
