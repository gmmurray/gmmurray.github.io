import React, { FC } from 'react';

import { TechnologyTree } from '../../types/cmsContent';
import classNames from 'classnames';

type TalentNodeProps = {
  onClick: () => any;
  selected: boolean;
} & TechnologyTree;

const baseClassName = 'talent-tree-row-node';
const activeClassName = baseClassName + '-active';

const TalentNode: FC<TalentNodeProps> = ({ onClick, selected, ...props }) => {
  const isActive = props.points > 0;
  return (
    <div
      id={props.id}
      className={classNames(baseClassName, {
        [activeClassName]: isActive,
        [`${activeClassName}-selected`]: isActive && selected,
        [`${baseClassName}-selected`]: !isActive && selected,
      })}
      onClick={onClick}
    >
      <span className="icon">
        <i className={props.code}></i>
      </span>
      <div className="talent-tree-points">
        {props.points}/{props.total}
      </div>
    </div>
  );
};

export default TalentNode;
