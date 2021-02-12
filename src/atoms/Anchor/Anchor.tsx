import React from 'react';
import './Anchor.scss';
import { IAnchorProps } from './Anchor.types';
const Anchor = ({ children, isHidden, isPrepared, isDataAttr, id }: IAnchorProps) => {
  const cls = ['anchor'];
  if (!isHidden) cls.push('anchor_show');
  if (isPrepared) cls.push('anchor_prepared');
  return (
    <li className={cls.join(' ')} data-anchor={isDataAttr ? 'pendingAnchor' : null} data-id={isHidden ? null : id}>
      {children ?? null}
    </li>
  );
};

export default React.memo(Anchor);
