import React, { Fragment } from 'react';

const TabContent = [
    {
        name: 'SS&C Advent',
        content:
            <Fragment>
                <div className="animated fadeIn">
                    <h4 className="title is-4 animated fadeIn">Software Development Internship</h4>
                    <h5 className="subtitle is-5">January 2020 - Present</h5>
                    <p className="is-size-4-desktop">-Research and debug existing codebase as a member of the Product Development team</p>
                    {/* <p className="is-size-4-desktop">-Submit bugfixes to development and production code</p> */}
                    <p className="is-size-4-desktop">-Enhance documentation for existing codebase</p>
                    <p className="is-size-4-desktop">-Assist in implementation and testing of new features</p>
                    <p className="is-size-4-desktop">-Follow Agile methodologies with daily standup and project board</p>
                </div>
            </Fragment>
    },
    {
        name: 'University of North Florida',
        content: 
            <Fragment>
                <div className="animated fadeIn">
                    <h4 className="title is-4">Lab Assistant/Tutor</h4>
                    <h5 className="subtitle is-5">August 2019 - December 2019</h5>
                    <p className="is-size-4-desktop">-Provide academic assistance to university students on the subjects of C, C++, Java, Computational Structures and Data Structures</p>
                    <p className="is-size-4-desktop">-Engage with students of varying academic levels (first to fourth year) to supplement their understanding of their current classes</p>
                    <p className="is-size-4-desktop">-Responsible for computer lab lock-up procedures at the end of the night</p>
                </div>
            </Fragment>
    },
    {
        name: 'Five STAR Veterans Center',
        content: 
            <Fragment>
                <div className="animated fadeIn">
                    <h4 className="title is-4">Web Consultant</h4>
                    <h5 className="subtitle is-5">June 2019 - Present</h5>
                    <p className="is-size-4-desktop">-Planned and designed potential website updates</p>
                    <p className="is-size-4-desktop">-Implemented updates after receiving approval from Chief Administrative Officer</p>
                    <p className="is-size-4-desktop">-Coordinated changes with designated company employees</p>
                    <p className="is-size-4-desktop">-Oversaw whole product lifecycle</p>
                    <p className="is-size-4-desktop">-Received feedback of increased traffic to the website</p>
                </div>
        </Fragment>
    },
];

export default TabContent