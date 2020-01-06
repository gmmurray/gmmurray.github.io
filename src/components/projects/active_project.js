import React, { Component, Fragment } from 'react';
import logo from 'src/images/icons/personal_logo_resize.png';

class ActiveProject extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                {this.props.image}
                <h3 className="title is-3">{this.props.title}</h3>
                <p className="is-size-4-desktop">{this.props.description}</p>
                <div className="tags">
                    {this.props.tags.map((value, index) => {
                        return <span className="tag is-link font-dark-blue" key={index}>{value}</span>
                    })}
                </div>
            </Fragment>
        );
    }
}

export default ActiveProject;