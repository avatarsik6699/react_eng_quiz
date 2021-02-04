import React from 'react';
import './Sentence.scss';
import { SentencePropsType } from './Sentence.types';

const Sentence = ({ children }: SentencePropsType) => {
  return (
    <div className="sentence">
      <span className="sentence__tip"></span>
      <ul className="sentence__word-list">{children}</ul>
    </div>
  );
};

export default Sentence;
