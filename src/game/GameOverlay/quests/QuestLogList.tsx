import { Experience, IdentifiableExperience } from '../../types/cmsContent';
import React, { FC, useCallback } from 'react';
import { gameCmsActions, gameCmsSelectors } from '../../redux/gameCmsSlice';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';
import { combineCss } from '../../helpers/combineCss';

type QuestLogListProps = {
  items: IdentifiableExperience[];
};

const base_cn = 'quest-log';
const list_cn = combineCss(base_cn, 'list');
const list_item_cn = combineCss(list_cn, 'item');
const active_list_item_cn = combineCss(list_item_cn, 'active');

const QuestLogList: FC<QuestLogListProps> = ({ items }) => {
  const dispatch = useDispatch();
  const activeQuest = useSelector(gameCmsSelectors.selectGameCmsSelectedQuest);

  const selectedExperience = useSelector(
    gameCmsSelectors.selectGameCmsSelectedQuest,
  );

  const handleSelectQuest = useCallback(
    (id: number) => () => dispatch(gameCmsActions.selectedQuestChanged(id)),
    [selectedExperience],
  );

  return (
    <div className={list_cn}>
      {items.map((item, index) => (
        <div
          key={index}
          className={classNames(list_item_cn, {
            [active_list_item_cn]: activeQuest === item.id,
          })}
          onClick={handleSelectQuest(item.id)}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default QuestLogList;
