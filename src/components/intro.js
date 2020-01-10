import React, { Component } from 'react';
import logo from '../images/icons/personal_logo_resize.png';
import ContactModal from './contactModal';

export default class Intro extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
        };
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
            <section className="hero is-fullheight section" id="intro">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="columns">
                            <div className="column">
                                <figure className="image container is-128x128">
                                    <img src={logo} alt="Greg Murray Logo" />
                                </figure>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <h1 className="title is-1">Welcome</h1>
                                <h2 className="subtitle is-2">My name is Greg Murray</h2>
                                <a className="button is-link font-dark-blue" onClick={toggleModal}>Get in touch</a>
                            </div>
                        </div>
                    </div>
                </div>
                <ContactModal
                    open={this.state.open}
                    toggleModal={toggleModal}
                />
            </section>
        );
    }
}