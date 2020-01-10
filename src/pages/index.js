import React, { Component, Fragment } from 'react';
import Intro from '../components/intro';
import About from '../components/about';
import Experiences from '../components/experiences/experiences';
import Projects from '../components/projects/projects';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import {spyScrolling} from '../helperFunctions';

class IndexPage extends Component {
    componentDidMount() {
        spyScrolling();
    }

    render() {
        return (
            <Fragment>
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

export default IndexPage