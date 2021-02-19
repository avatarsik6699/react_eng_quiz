import React from 'react';
import { StyledAnswerWord } from './AnswerWord.styles';
import { IAnswerWordProps } from './AnswerWord.types';
const AnswerWord = ({ content, style, onMouseDown }: IAnswerWordProps) => {
  return (
    <StyledAnswerWord
      style={style}
      className={'answer-word'}
      onMouseDown={onMouseDown ?? null}
      onTouchStart={onMouseDown ?? null}
    >
      {content}
    </StyledAnswerWord>
  );
};

export default AnswerWord;
