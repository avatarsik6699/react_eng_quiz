import React from 'react';
import './Anchor.scss';
import { AnchorPropsType } from './Anchor.types';
const Anchor = ({ children }: AnchorPropsType) => {
  return <li className="anchor">{children ?? null}</li>;
};

export default Anchor;
