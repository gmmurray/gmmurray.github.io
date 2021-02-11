require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Greg Murray Personal Website`,
    description: `Personal website built in Gatsby using React`,
    author: `Greg Murray`,
  },
  plugins: [
    'gatsby-plugin-root-import',
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Greg Murray Personal Website`,
        short_name: `Greg Murray`,
        start_url: `/`,
        background_color: `#131D68`,
        theme_color: `#EBAA02`,
        display: `standalone`,
        icon: 'src/images/icons/personal_logo_resize.png',
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'G-7X6LKRLGJL',
        head: true,
      },
    },
    {
      resolve: 'gatsby-source-graphcms',
      options: {
        endpoint: process.env.GRAPHCMS_ENDPOINT,
        token: process.env.GRAPHCMS_TOKEN,
        downloadLocalImages: true,
      },
    },
  ],
};
