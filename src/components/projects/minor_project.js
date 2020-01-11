import React, { Component } from 'react';

export default class MinorProject extends Component {
    render() {
        const repo = this.props.repo === '';
        const link = this.props.link === '';
        return (
            <div className="card">
                <header className="card-header">
                    <div className="card-header-title">
                        <h4 className="title is-4">{this.props.title}</h4>
                    </div>
                </header>
                <div className="card-content">
                    <div className="tags">
                        {this.props.tags.map((value, index) => {
                            return <span className="tag is-link font-dark-blue" key={index}>{value}</span>
                        })}
                    </div>
                    <div className="content">
                        {this.props.description}
                    </div>
                </div>
                <footer className="card-footer">
                    {repo ? null : (<a href={this.props.repo} className="card-footer-item">GitHub</a>)}
                    {link ? null : (<a href={this.props.link} className="card-footer-item">Website</a>)}
                </footer>
            </div>
        );
    }
}