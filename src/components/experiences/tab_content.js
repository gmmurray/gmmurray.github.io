import React, { Fragment } from "react"

const TabContent = [
  {
    name: "SS&C Advent",
    content: (
      <Fragment>
        <div className="animated fadeIn">
          <h4 className="title is-4 animated fadeIn">
            Contract Software Engineer
          </h4>
          <h5 className="subtitle is-5">
            May 2020 - Present (Intern January - May)
          </h5>
          <p className="is-size-4-desktop">
            -Develop frontend solutions with React/Redux
          </p>
          {/* <p className="is-size-4-desktop">-Submit bugfixes to development and production code</p> */}
          <p className="is-size-4-desktop">
            -Build backend code using C# in ASP.NET in addition to SQL and
            MongoDB
          </p>
          <p className="is-size-4-desktop">
            -Oversee my code from planning and research, through development and
            testing, to production deployment
          </p>
          <p className="is-size-4-desktop">
            -Participate in an Agile team and contribute to code review
          </p>
          <p className="is-size-4-desktop">-Utilize Git version control</p>
        </div>
      </Fragment>
    ),
  },
  {
    name: "University of North Florida",
    content: (
      <Fragment>
        <div className="animated fadeIn">
          <h4 className="title is-4">Lab Assistant/Tutor</h4>
          <h5 className="subtitle is-5">August 2019 - December 2019</h5>
          <p className="is-size-4-desktop">
            -Provide academic assistance to university students on the subjects
            of C, C++, Java, Computational Structures and Data Structures
          </p>
          <p className="is-size-4-desktop">
            -Engage with students of varying academic levels (first to fourth
            year) to supplement their understanding of their current classes
          </p>
          <p className="is-size-4-desktop">
            -Responsible for computer lab lock-up procedures at the end of the
            night
          </p>
        </div>
      </Fragment>
    ),
  },
  {
    name: "Five STAR Veterans Center",
    content: (
      <Fragment>
        <div className="animated fadeIn">
          <h4 className="title is-4">Web Consultant</h4>
          <h5 className="subtitle is-5">June 2019 - May 2020</h5>
          <p className="is-size-4-desktop">
            -Planned and designed potential website updates
          </p>
          <p className="is-size-4-desktop">
            -Implemented updates after receiving approval from Chief
            Administrative Officer
          </p>
          <p className="is-size-4-desktop">
            -Coordinated changes with designated company employees
          </p>
          <p className="is-size-4-desktop">-Oversaw whole product lifecycle</p>
          <p className="is-size-4-desktop">
            -Received feedback of increased traffic to the website
          </p>
        </div>
      </Fragment>
    ),
  },
]

export default TabContent
