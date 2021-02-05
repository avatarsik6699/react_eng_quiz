import React from 'react';
import './Anchor.scss';
import { AnchorPropsType } from './Anchor.types';
const Anchor = ({ children }: AnchorPropsType) => {
  return <div className="anchor">{children}</div>;
};

export default Anchor;
