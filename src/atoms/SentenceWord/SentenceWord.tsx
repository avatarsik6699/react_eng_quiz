import React from 'react';
import { SentenceWordProps } from './SentenceWord.types';
import './SentenceWord.scss';
const SentenceWord = ({ content }: SentenceWordProps) => {
  return <span className="sentence-word">{content}</span>;
};

export default SentenceWord;
