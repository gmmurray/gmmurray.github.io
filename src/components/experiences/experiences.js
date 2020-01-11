import React, { Component } from 'react';
import Tabs from './tabs';
import TabContent from './tab_content';
import ActiveTabContent from './active_tab_content';

export default class Experiences extends Component {
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
            <section className="container section" id="experiences">
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
            </section>
        );
    }
}