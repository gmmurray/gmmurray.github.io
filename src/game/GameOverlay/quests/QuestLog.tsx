import './styles.scss';

import { Experience, IdentifiableExperience } from '../../types/cmsContent';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { filterQuests, identifyQuests } from './filterQuests';
import { gameCmsActions, gameCmsSelectors } from '../../redux/gameCmsSlice';
import { useDispatch, useSelector } from 'react-redux';

import ActiveQuestItem from './ActiveQuestItem';
import QuestLogList from './QuestLogList';
import classNames from 'classnames';
import { combineCss } from '../../helpers/combineCss';

const base_cn = 'quest-log';
const container_cn = combineCss(base_cn, 'container');
const header_cn = combineCss(base_cn, 'header');
const header_item_cn = combineCss(header_cn, 'item');
const header_item_active_cn = combineCss(header_item_cn, 'active');
const pane_container_cn = combineCss(base_cn, 'pane-container');

const HeaderItem: FC<{
  active: boolean;
  onClick: () => any;
  content: string;
}> = ({ active, onClick, content }) => (
  <h1
    className={classNames(header_item_cn, { [header_item_active_cn]: active })}
    onClick={onClick}
  >
    {content}
  </h1>
);

const QuestLog = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(gameCmsSelectors.selectGameCmsSelectedQuestTab);
  const activeQuest = useSelector(gameCmsSelectors.selectGameCmsSelectedQuest);

  const experiencesContent = useSelector(
    gameCmsSelectors.selectGameCmsExperiencesContent,
  );

  const [filteredQuests, setFilteredQuests] = useState<
    IdentifiableExperience[]
  >([]);

  const identifiedQuests = useMemo(
    () => identifyQuests(experiencesContent ?? []),
    [experiencesContent],
  );

  useEffect(
    () => setFilteredQuests(filterQuests(identifiedQuests, activeTab)),
    [activeTab],
  );

  useEffect(() => {
    if (filteredQuests.length > 0)
      dispatch(gameCmsActions.selectedQuestChanged(filteredQuests[0].id));
  }, [filteredQuests]);

  const handleTabClick = useCallback(
    (tab: 0 | 1 | 2) => () => {
      if (tab !== activeTab) {
        dispatch(gameCmsActions.selectedQuestTabChanged(tab));
      }
    },
    [activeTab],
  );

  return (
    <div className={container_cn}>
      <div className={header_cn}>
        <HeaderItem
          active={activeTab === 0}
          onClick={handleTabClick(0)}
          content="All"
        />
        <HeaderItem
          active={activeTab === 1}
          onClick={handleTabClick(1)}
          content="Active"
        />
        <HeaderItem
          active={activeTab === 2}
          onClick={handleTabClick(2)}
          content="Completed"
        />
      </div>
      <div className={pane_container_cn}>
        <QuestLogList items={filteredQuests} />
        <ActiveQuestItem
          item={filteredQuests.find(item => item.id === activeQuest)}
        />
      </div>
    </div>
  );
};

export default QuestLog;
