import React from 'react';
import './AnswerWord.scss';
import { AnswerWordPropsType } from './AnswerWord.types';
const AnswerWord = ({ content, style, onMouseDown }: AnswerWordPropsType) => {
  const cls = ['answer-word'];
  return (
    <span style={style ?? null} onMouseDown={onMouseDown ?? null} className={cls.join(' ')}>
      {content}
    </span>
  );
};

export default React.memo(AnswerWord);
