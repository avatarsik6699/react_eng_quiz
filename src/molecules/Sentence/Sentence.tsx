import React from 'react';
import { SentenceList, SentenceTip, StyledSentence } from './Sentence.styles';
import { SentencePropsType } from './Sentence.types';

const Sentence = ({ children }: SentencePropsType) => {
  return (
    <StyledSentence>
      <SentenceTip />
      <SentenceList>{children}</SentenceList>
    </StyledSentence>
  );
};

export default Sentence;
