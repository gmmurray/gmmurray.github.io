import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet";
import Intro from '../components/intro';
import About from '../components/about/about';
import Experiences from '../components/experiences/experiences';
import Projects from '../components/projects/projects';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { spyScrolling } from '../helperFunctions';

export default class IndexPage extends Component {
    componentDidMount() {
        spyScrolling();
    }

    render() {
        return (
            <Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Jacksonville, FL Computing Student</title>
                </Helmet>
                <Intro />
                <Navigation />
                <About />
                <Experiences />
                <Projects />
                <Footer />
            </Fragment>
        )
    }
}