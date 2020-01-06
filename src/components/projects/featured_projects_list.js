import React, { Fragment } from 'react';

const FeaturedProjectsList = [
    {
        title: 'Bulma',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project1.png')}/></figure></Fragment>,
        tags: ['HTML', 'CSS']
    },
    {
        title: 'GatsbyJS',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project2.png')}/></figure></Fragment>,
        tags: ['HTML', 'CSS']
    },
    {
        title: 'ReactJS',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project3.png')}/></figure></Fragment>,
        tags: ['HTML', 'CSS', 'JavaScript ES6']
    },
    {
        title: 'Visual Studio Code',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project4.png')}/></figure></Fragment>,
        tags: ['Electron', 'NodeJS']
    },
    {
        title: 'GitHub',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project5.png')}/></figure></Fragment>,
        tags: ['HTML', 'CSS', 'JavaScript']
    },
];

export default FeaturedProjectsList