import React from 'react';
import { ISentenceWordProps } from './SentenceWord.types';
import './SentenceWord.scss';
const SentenceWord = ({ content }: ISentenceWordProps) => {
  return <span className="sentence-word">{content}</span>;
};

export default React.memo(SentenceWord);
