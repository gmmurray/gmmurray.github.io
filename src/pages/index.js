import React, { Component, Fragment } from 'react';
import Intro from '../components/intro';
import About from '../components/about';
import Experiences from '../components/experiences';
import Projects from '../components/projects';
import Navigation from '../components/navigation';

class IndexPage extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.spyScrolling();
    }

    spyScrolling = () => {
        const sections = document.querySelectorAll('.hero');

        window.onscroll = () => {
            const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;

            for (let s in sections)
                if (sections.hasOwnProperty(s) && sections[s].offsetTop <= scrollPos) {
                    const id = sections[s].id;
                    let node = document.querySelector('.active-nav-item');
                    if (node) {
                        node.classList.remove('active-nav-item');
                    }
                    //document.querySelector( '.is-active' ).classList.remove( 'is-active' );
                    if (id !== 'intro') document.querySelector(`a[href*=${id}]`).classList.add('active-nav-item');
                    //(id === 'about' || id === 'experiences' || id === 'projects') ? document.querySelector( '.navbar' ).classList.add( 'show' ) : document.querySelector( '.navbar' ).classList.remove( 'show' );
                    //document.querySelector( '.navbar' ).classList.add( 'show' );
                }
        }
    }

    render() {
        return (
            <Fragment>
                <Intro />
                <Navigation />
                <About />
                <Experiences />
                <Projects />
            </Fragment>
        )
    }


}

export default IndexPage