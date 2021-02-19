import React from 'react';
import { ISentenceWordProps } from './SentenceWord.types';
import StyledSentenceWord from './SentenceWord.styles';
const SentenceWord = ({ content }: ISentenceWordProps) => {
  return <StyledSentenceWord>{content}</StyledSentenceWord>;
};

export default React.memo(SentenceWord);
