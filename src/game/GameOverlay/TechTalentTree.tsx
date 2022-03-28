import React, { FC } from 'react';

import { TechnologyTree } from '../types/cmsContent';
import Xarrow from 'react-xarrows';
import classNames from 'classnames';
import { constructTechTree } from '../helpers/constructTechTree';
import { gameCmsSelectors } from '../redux/gameCmsSlice';
import { useSelector } from 'react-redux';

const TalentNode: FC<TechnologyTree> = ({
  content,
  id,
  code,
  points,
  total,
}) => (
  <div
    id={id}
    className={classNames('talent-tree-row-node', {
      'talent-tree-row-node-active': points > 0,
    })}
  >
    <span className="icon">
      <i className={code}></i>
    </span>
    <div className="talent-tree-points">
      {points}/{total}
    </div>
  </div>
);

const createRows = (data: TechnologyTree) => {
  const items = { ...data };
  const rows = [];

  const createNodes = (node: TechnologyTree, rowNum: number) => {
    if (rows[rowNum]) {
      rows[rowNum].push(node);
    } else {
      rows[rowNum] = [node];
    }

    if (node.children) {
      node.children.forEach(child => createNodes(child, rowNum + 1));
    }
  };

  createNodes(items, 0);
  return rows;
};

const TechTalentTree = () => {
  const { technologyTree: data } = useSelector(
    gameCmsSelectors.selectGameCmsData,
  );

  const tree = constructTechTree({ ...data });
  const talentTrees = tree?.children.map(c => createRows(c));

  return (
    <div className="game-overlay-component-container talent-tree">
      <div className="talent-tree-container">
        {talentTrees[0].map((row: TechnologyTree[]) => (
          <div className="talent-tree-row">
            {row.map(item => (
              <>
                <TalentNode {...item} />
                {item.parent !== undefined && (
                  <Xarrow
                    key={item.content}
                    start={item.id}
                    end={item.parent}
                    curveness={0}
                    showTail={false}
                    showHead={false}
                    animateDrawing={false}
                    color={item.points > 0 ? '#fff' : '#976f08'}
                    endAnchor="bottom"
                    startAnchor="top"
                  />
                )}
              </>
            ))}
          </div>
        ))}
      </div>
      <div className="talent-tree-info"></div>
    </div>
  );
  return <div>hi</div>;
};

export default TechTalentTree;
