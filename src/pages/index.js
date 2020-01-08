import React, { Component, Fragment } from 'react';
import Intro from '../components/intro';
import About from '../components/about';
import Experiences from '../components/experiences/experiences';
import Projects from '../components/projects/projects';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    componentDidMount() {
        this.spyScrolling();
    }

    spyScrolling = () => {
        const sections = document.querySelectorAll('.section');

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
        const toggleModal = () => {
            if (this.state.open) {
                this.setState({ open: false });
            } else {
                this.setState({ open: true });
            }
        };

        return (

            <Fragment>
                <a className="button is-link" onClick={toggleModal}>Modal</a>
                <div className={`modal ${this.state.open ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Send me an email</p>
                            <button className="modal-close is-large" onClick={toggleModal} aria-label="close"></button>
                        </header>
                        <section className="modal-card-body">
                            <form>
                            <div className="field">
                                <label className="label">To</label>
                                <div className="control">
                                    <input className="input" type="text" />
                                </div>
                            </div>
                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link font-dark-blue">Submit</button>
                                </div>
                                <div className="control">
                                    <button className="button is-link is-outlined">Cancel</button>
                                </div>
                            </div>
                            </form>
                        </section>
                    </div>
                </div>
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