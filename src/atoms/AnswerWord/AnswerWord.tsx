import React from 'react';
import './AnswerWord.scss';
import { AnswerWordPropsType } from './AnswerWord.types';
const AnswerWord = ({ content, style, onMouseDown }: AnswerWordPropsType) => {
  return (
    <span style={style ?? null} onMouseDown={onMouseDown ?? null} className="answer-word">
      {content}
    </span>
  );
};

export default AnswerWord;
