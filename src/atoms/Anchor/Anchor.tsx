import React from 'react';
import './Anchor.scss';
import { AnchorPropsType } from './Anchor.types';
const Anchor = ({
  children,
  isHidden,
  isPrepared,
  isdisappear,
  isDataAttr,
  id,
}: AnchorPropsType) => {
  return (
    <li
      className={`anchor ${isHidden ? 'hidden' : ''} ${isPrepared ? 'prepared' : ''} ${
        isdisappear ? 'disappear' : ''
      }`}
      data-anchor={isDataAttr ? 'pendingAnchor' : ''}
      data-id={id}
    >
      {children ?? null}
    </li>
  );
};

export default React.memo(Anchor);
