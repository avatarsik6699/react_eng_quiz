import React from 'react';
import './AnswerWord.scss';
import { IAnswerWordProps } from './AnswerWord.types';
const AnswerWord = ({ content, style, onMouseDown }: IAnswerWordProps) => {
  const cls = ['answer-word'];
  return (
    <span style={style ?? null} onMouseDown={onMouseDown ?? null} className={cls.join(' ')}>
      {content}
    </span>
  );
};

export default React.memo(AnswerWord);
