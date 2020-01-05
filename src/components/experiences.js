import React, { Component } from 'react';
import logo from '../images/icons/personal_logo_resize.png';
import { CSSTransitionGroup } from 'react-transition-group';
import Tabs from './bulma/tabs';
import TabContent from './bulma/tab_content';
import ActiveTabContent from './bulma/active_tab_content';

class Experiences extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'SS&C Advent'
        };
    }

    changeActiveTab(tab) {
        this.setState({ activeTab: tab });
    }

    activeTabContent() {
        const activeIndex = TabContent.findIndex((tab) => {
            return tab.name === this.state.activeTab;
        });

        return TabContent[activeIndex].content;
    }

    render() {
        return (
            <section className="hero" id="experiences">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title is-2 has-text-centered">Experiences</h2>
                        <Tabs
                            tabContent={TabContent}
                            activeTab={this.state.activeTab}
                            changeActiveTab={this.changeActiveTab.bind(this)}
                        />

                        <ActiveTabContent
                            key={this.state.activeTab}
                            content={this.activeTabContent()}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

export default Experiences;