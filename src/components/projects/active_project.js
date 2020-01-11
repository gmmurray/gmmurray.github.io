import React, { Component, Fragment } from 'react';

export default class ActiveProject extends Component {
    render() {
        return (
            <Fragment>
                <div className="columns">
                    <div className="column is-half">
                        {this.props.image}
                    </div>
                    <div className="column">
                        {this.props.title}
                        <div className="tags">
                            {this.props.tags.map((value, index) => {
                                return <span className="tag is-link font-dark-blue" key={index}>{value}</span>
                            })}
                        </div>
                        {this.props.description}
                    </div>
                </div>
                <div className="columns">
                    <div className="column"></div>
                    <div className="column has-text-centered">
                        <button disabled={this.props.prevDisabled} className="button is-link font-dark-blue grouped-button-margin" onClick={this.props.prevClick}>Prev</button>
                        <button disabled={this.props.nextDisabled} className="button is-link font-dark-blue grouped-button-margin" onClick={this.props.nextClick}>Next</button>
                    </div>
                    <div className="column"></div>
                </div>

            </Fragment>
        );
    }
}