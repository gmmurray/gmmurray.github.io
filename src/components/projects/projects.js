import React, { Component } from 'react';
import ActiveProject from './active_project';
import FeaturedProjectsList from './featured_projects_list';
import OtherProjects from './other_projects';

class FeaturedProjects extends Component {
    constructor(props) {
        super(props);
        const intitialIndex = 0;
        this.state = {
            index: intitialIndex,
            activeProject: FeaturedProjectsList[intitialIndex],
            firstItem: 0,
            lastItem: FeaturedProjectsList.length - 1
        };
    }

    render() {
        return (
            <section className="container section" id="projects">
                <h4 className="title is-2">Projects</h4>
                <ActiveProject
                    key={this.state.activeProject.title}
                    title={this.state.activeProject.title}
                    description={this.state.activeProject.description}
                    image={this.state.activeProject.image}
                    tags={this.state.activeProject.tags}
                    prevClick={() => this.setState({ activeProject: FeaturedProjectsList[this.state.index - 1], index: this.state.index - 1 })}
                    nextClick={() => this.setState({ activeProject: FeaturedProjectsList[this.state.index + 1], index: this.state.index + 1 })}
                    prevDisabled={this.state.index === this.state.firstItem}
                    nextDisabled={this.state.index === this.state.lastItem}
                />
                <OtherProjects />
            </section>
        );
    }
}

export default FeaturedProjects