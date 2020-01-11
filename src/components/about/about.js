import React from 'react';
import headshot from '../../images/professional_for_web.jpg';
import { aboutMe, languages } from './content';

export default () => (
    <section className="container section" id="about">
        <div className="columns">
            <div className="column is-one-third">
                <figure className="image container">
                    <img src={headshot} alt="Greg Murray Logo" />
                </figure>
            </div>
            <div className="column">
                <h2 className="title is-2">About me</h2>
                <p className="is-size-4-desktop">{aboutMe}</p>
                <h4 className="title is-4 padded-header">Languages and Technology</h4>
                <div className="columns is-multiline">
                    {languages.map((value, index) => {
                        return (
                            <div className="column is-half" key={index}>-{value}</div>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
)