import React from 'react';
import './Anchor.scss';
import { AnchorPropsType } from './Anchor.types';
const Anchor = ({ children, isHidden, isPrepared, isdisappear }: AnchorPropsType) => {
  return (
    <li
      className={`anchor ${isHidden ? 'hidden' : ''} ${isPrepared ? 'prepared' : ''} ${
        isdisappear ? 'disappear' : ''
      }`}
    >
      {children ?? null}
    </li>
  );
};

export default React.memo(Anchor);
