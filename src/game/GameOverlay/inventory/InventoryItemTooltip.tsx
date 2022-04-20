import React, { FC, useCallback, useState } from 'react';

import { InventoryProject } from '../../types/cmsContent';
import { combineCss } from '../../helpers/combineCss';

type InventoryItemTooltipProps = {
  item: InventoryProject;
  hidden: boolean;
};

const base_cn = 'inventory-item-tooltip';
const children_cn = combineCss(base_cn, 'children');
const container_cn = combineCss(base_cn, 'container');

const InventoryItemTooltip: FC<InventoryItemTooltipProps> = ({
  item,
  hidden,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const handleMouseOver = useCallback(
    (value: boolean) => () => {
      setVisible(value);
    },
    [],
  );

  const handleHide = useCallback(() => setVisible(false), []);
  return (
    <div
      className={children_cn}
      onMouseOver={handleMouseOver(true)}
      onMouseLeave={handleMouseOver(false)}
      onClick={handleHide}
    >
      {children}
      {!hidden && visible && <div className={container_cn}>{item.title}</div>}
    </div>
  );
};

export default InventoryItemTooltip;
