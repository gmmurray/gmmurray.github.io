import React, { Component, Fragment } from 'react';
import OtherProjectsList from './other_projects_list';
import MinorProject from './minor_project';

class OtherProjects extends Component {
    constructor(props) {
        super(props);

        const initialProjectCount = 3;
        this.state = {
            page: initialProjectCount,
            projects: OtherProjectsList.slice(0, initialProjectCount)
        };
    }
    render() {
        const nextProjects = () => {
            let nextThree = OtherProjectsList.slice(0, this.state.page + 3)
            this.setState({
                page: this.state.page + 3,
                projects: nextThree
            });
        };

        return (
            <Fragment>
                <div className="columns is-multiline">
                    {this.state.projects.map((value, index) => {
                        return (
                            <div className="column is-one-third animated fadeIn">
                                <MinorProject
                                    key={index}
                                    title={value.title}
                                    tags={value.tags}
                                    description={value.description}
                                    repo={value.repo}
                                    link={value.link}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="columns has-text-centered">
                    <div className="column"></div>
                    <div className="column">
                        <button disabled={this.state.page >= OtherProjectsList.length} onClick={nextProjects} className="button is-link font-dark-blue">More</button>
                    </div>
                    <div className="column"></div>
                </div>
            </Fragment>

        );
    }
}

export default OtherProjects