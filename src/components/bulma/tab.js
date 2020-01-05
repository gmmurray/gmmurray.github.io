import React from 'react';

const Tab = (props) => {
    const { name } = props.tab;
    const { activeTab, changeActiveTab } = props;

    return (
        <li className={`${(activeTab === name) ? "is-active has-font-weight-bold" : ""}`} onClick={() => changeActiveTab(name)}>
            <a>
                <span>{name}</span>
            </a>
        </li>
    );
};

export default Tab