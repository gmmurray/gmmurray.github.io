import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './tab';

class Tabs extends Component {
    static propTypes = { 
        tabContent: PropTypes.array.isRequired, 
        activeTab: PropTypes.string, 
        changeActiveTab: PropTypes.func
    };

    render() {
        return (
            <div className="tabs is-centered is-large">
                <ul>
                    {
                        this.props.tabContent.map(
                            tab => 
                                <Tab 
                                    tab={tab} 
                                    key={tab.name}
                                    activeTab={this.props.activeTab}
                                    changeActiveTab={this.props.changeActiveTab} 
                                />
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default Tabs