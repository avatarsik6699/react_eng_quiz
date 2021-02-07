import React from 'react';
import './Anchor.scss';
import { AnchorPropsType } from './Anchor.types';
const Anchor = ({ children, isHidden, isPrepared }: AnchorPropsType) => {
  return (
    <li className={`anchor ${isHidden ? 'hidden' : ''} ${isPrepared ? 'prepared' : ''}`}>
      {children ?? null}
    </li>
  );
};

export default React.memo(Anchor);
