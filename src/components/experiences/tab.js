import React from 'react';

const Tab = (props) => {
    const { name } = props.tab;
    const { activeTab, changeActiveTab } = props;

    return (
        <li className={`${(activeTab === name) ? "is-active has-font-weight-bold" : ""}`}>
            <a onClick={() => changeActiveTab(name)}>
                <span>{name}</span>
            </a>
        </li>
    );
};

export default Tab