import React, {Component} from 'react';
import OtherProjectsList from './other_projects_list';
import MinorProject from './minor_project';

class OtherProjects extends Component {
    render(){
        const otherProjects = OtherProjectsList;
        return(
            <div className="columns is-multiline">
                {otherProjects.map((value, index) => {
                    return (
                        <div className="column is-one-third">
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
        );
    }
}

export default OtherProjects