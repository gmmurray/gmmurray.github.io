import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  THEME_DARK_YELLOW,
  THEME_LIGHT_GREY,
  THEME_WHITE,
  THEME_YELLOW,
} from '../../constants';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { constructTechTree, createRows } from '../../helpers/constructTechTree';
import { gameCmsActions, gameCmsSelectors } from '../../redux/gameCmsSlice';
import { mdiArrowLeftThick, mdiArrowRightThick } from '@mdi/js';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '@mdi/react';
import TalentNode from './TalentNode';
import { TechnologyTree } from '../../types/cmsContent';
import classNames from 'classnames';

const TechTalentTree = () => {
  const dispatch = useDispatch();
  const { technologyTree: data } = useSelector(
    gameCmsSelectors.selectGameCmsData,
  );
  const selectedTreeIndex = useSelector(
    gameCmsSelectors.selectSelectedTalentTree,
  );

  const [selectedNode, setSelectedNode] = useState<TechnologyTree | null>(null);

  const [treeIsVisible, setTreeIsVisible] = useState(false);
  const [infoIsVisible, setInfoIsVisible] = useState(false);

  const tree = useMemo(() => constructTechTree({ ...data }), [data]);
  const talentTrees = tree?.children.map(c => createRows(c));

  const handleNextTree = useCallback(() => {
    if (selectedTreeIndex === talentTrees.length - 1) {
      return;
    }
    dispatch(gameCmsActions.selectedTalentTreeChanged(selectedTreeIndex + 1));
  }, [talentTrees]);

  const handlePrevTree = useCallback(() => {
    if (selectedTreeIndex === 0) {
      return;
    }
    dispatch(gameCmsActions.selectedTalentTreeChanged(selectedTreeIndex - 1));
  }, [talentTrees]);

  useEffect(() => {
    setSelectedNode(null);
  }, [selectedTreeIndex]);

  const handleSelectNode = useCallback(
    (node: TechnologyTree | null) => setSelectedNode(node),
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(() => setTreeIsVisible(true), 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const newValue = selectedNode !== null;
    setInfoIsVisible(newValue);
  }, [selectedNode]);

  return (
    <div className="game-overlay-component-container talent-tree">
      <div
        className={classNames('talent-tree-container', {
          'talent-tree-container-shifted': selectedNode !== null,
          'talent-tree-container-visible': treeIsVisible,
        })}
      >
        <div className="talent-tree-selector">
          <button
            className="button is-small"
            disabled={selectedTreeIndex === 0}
            onClick={handlePrevTree}
          >
            <Icon path={mdiArrowLeftThick} size={1} />
          </button>
          <button
            className="button is-small talent-tree-selector-next"
            disabled={selectedTreeIndex === talentTrees.length - 1}
            onClick={handleNextTree}
          >
            <Icon path={mdiArrowRightThick} size={1} />
          </button>
        </div>
        {talentTrees[selectedTreeIndex].map((row: TechnologyTree[]) => (
          <div className="talent-tree-row">
            {row.map(item => {
              const selected = selectedNode && selectedNode.id === item.id;

              const nodeProps = {
                ...item,
                selected,
                onClick: () => handleSelectNode(selected ? null : item),
              };

              let arrowColor: string;
              if (item.points > 0) {
                arrowColor = selected ? THEME_WHITE : THEME_LIGHT_GREY;
              } else {
                arrowColor = selected ? THEME_YELLOW : THEME_DARK_YELLOW;
              }

              return (
                <Fragment>
                  <Xwrapper key={item.id}>
                    <TalentNode {...nodeProps} />
                    {item.parent !== undefined && (
                      <Xarrow
                        key={`${item.id}-${selected}`}
                        start={item.id}
                        end={item.parent}
                        curveness={0}
                        showTail={false}
                        showHead={false}
                        animateDrawing={false}
                        color={arrowColor}
                        endAnchor="bottom"
                        startAnchor="top"
                      />
                    )}
                  </Xwrapper>
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>
      {selectedNode && (
        <div
          className={classNames('talent-tree-info', {
            'talent-tree-info-visible': infoIsVisible,
          })}
        >
          <div className="talent-tree-info-header">
            <p className="talent-tree-info-header-title">
              {selectedNode.title}
            </p>
            <p className="talent-tree-info-header-points">
              {selectedNode.points}/{selectedNode.total}
            </p>
          </div>
          <p className="talent-tree-info-content">{selectedNode.content}</p>
        </div>
      )}
    </div>
  );
};

export default TechTalentTree;
