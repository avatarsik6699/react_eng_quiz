import React from 'react';
import './AnswerWord.scss';
import { AnswerWordPropsType } from './AnswerWord.types';
const AnswerWord = ({ content }: AnswerWordPropsType) => {
  return (
    <span onMouseDown={(ev) => console.log(ev.target)} className="answer-word">
      {content}
    </span>
  );
};

export default AnswerWord;
