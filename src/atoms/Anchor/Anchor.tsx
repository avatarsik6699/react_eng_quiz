import React from 'react';
import './Anchor.scss';
import { AnchorPropsType } from './Anchor.types';
const Anchor = ({ children, isHidden }: AnchorPropsType) => {
  return <li className={`anchor ${isHidden ? 'hidden' : ''}`}>{children ?? null}</li>;
};

export default Anchor;
