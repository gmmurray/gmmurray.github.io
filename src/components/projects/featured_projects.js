import React, { Component } from 'react';
import ActiveProject from './active_project';
import FeaturedProjectsList from './featured_projects_list';

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

    nextProject(){
        let i = this.state.index;
        this.setState({
            index: i,
            activeProject: FeaturedProjectsList[this.state.index]
        });
    }

    render() {
        return (
            <section className="hero is-fullheight" id="projects">
                <div className="hero-body">
                    <div className="container">
                        <h4 className="title is-2">Projects</h4>
                        <ActiveProject
                            key={this.state.activeProject.title}
                            title={this.state.activeProject.title}
                            description={this.state.activeProject.description}
                            image={this.state.activeProject.image}
                            tags={this.state.activeProject.tags}
                        />
                        <div className="field has-addons">
                            <p className="control">
                                <button disabled={this.state.index === this.state.firstItem} className="button is-link font-dark-blue" onClick={() => this.setState({activeProject: FeaturedProjectsList[--this.state.index]})}>Prev</button>
                            </p>
                            <p className="control">
                                <button disabled={this.state.index === this.state.lastItem} className="button is-link font-dark-blue" onClick={() => this.setState({activeProject: FeaturedProjectsList[++this.state.index]})}>Next</button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default FeaturedProjects