import React, { Fragment } from 'react';

const FeaturedProjectsList = [
    {
        title: <Fragment><a className="title is-3 is-link" href="https://federfitnessandnutrition.com/" target="_blank" rel="noopener"><h3>Feder Fitness and Nutrition</h3></a></Fragment>,
        description: <Fragment><p className="is-size-4-desktop">Business website for a local personal trainer and nutritionist. It includes an 'about me' section in addition to pricing and how to contact him. Uses <a href="https://mdbootstrap.com/" target="_blank" rel="noopener">MDBootstrap</a> for styling, a <a href="https://mailthis.to/" target="_blank" rel="noopener">free emailing service</a> for the contact form, and <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> for hosting.</p></Fragment>,
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project1.png')}/></figure></Fragment>,
        tags: ['HTML', 'CSS', 'jQuery', 'MDBootstrap']
    },
    {
        title: <Fragment><a className="title is-3 is-link" href="https://gregmurray.org/turfdoctor-angular/home" target="_blank" rel="noopener"><h3>Turf Doctor Landscaping & Lawn</h3></a></Fragment>,
        description: <Fragment><p className="is-size-4-desktop">Business website for local full-service landscaping and lawn company built in Angular 8. Currently awaiting the final text and images from the business to complete the website. Uses <a href="https://mdbootstrap.com/" target="_blank" rel="noopener">MDBootstrap</a> for styling, <a href="https://mailthis.to/" target="_blank" rel="noopener">free emailing service</a> and <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> for hosting. Created a custom image gallery component with filtering, paging (using a prebuilt component), and modals for image descriptions.</p></Fragment>,
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project2.png')}/></figure></Fragment>,
        tags: ['Angular 8','TypeScript', 'HTML', 'CSS', 'MDBootstrap']
    },
    {
        title: <Fragment><a className="title is-3 is-link"><h3>This website</h3></a></Fragment>,
        description: <Fragment><p className="is-size-4-desktop">I built this personal website primarly to replace the first iteration of my website which is a very simple HTML/CSS website. It was a great opportunity to get some new experience, so I decided to learn GatsbyJS, ReactJS and some Sass to build this website. I built all of the components myself, with the only outside packages coming from <a href="https://daneden.github.io/animate.css/" target="_blank" rel="noopener">AnimateCSS</a> for some of the simple animations used. I used the <a href="https://bulma.io/" target="_blank" rel="noopener">Bulma</a> CSS framework (no JavaScript included) for styling and <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> for hosting.</p></Fragment>,
        image: <Fragment><figure className="image is-16by9"><img src={require('src/images/featured_projects/project3.png')}/></figure></Fragment>,
        tags: ['ReactJS', 'GatsbyJS', 'JavaScript ES6', 'Bulma', 'HTML', 'CSS']
    }
];

export default FeaturedProjectsList