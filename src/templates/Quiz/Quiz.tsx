import React, { useState } from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import SentenceWord from '../../atoms/SentenceWord/SentenceWord';
import Title from '../../atoms/Title/Title';
import DropZone from '../../molecules/DropZone/DropZone';
import Sentence from '../../molecules/Sentence/Sentence';

import './Quiz.scss';
const sentenceWords = [
  'She',
  'is',
  'eating',
  'an',
  'apple',
  'and',
  'and',
  'they',
  'are',
  'eating',
  'bread',
];
const answerWords = [
  'esse',
  'esst',
  'brot',
  'essen',
  'apfel',
  'sie',
  'und',
  'sie',
  'isst',
  'einen',
  'sie',
  'sie',
  'sie',
  'sie',
  'sie',
];

const Quiz = () => {
  const [isError, setError] = useState(false);
  return (
    <div className="quiz">
      <Title content="Translate this sentence" />
      <div className="quiz-info" style={{ display: 'flex' }}>
        <Avatar />
        <Sentence>
          {sentenceWords.map((word, index) => (
            <li key={index}>
              <SentenceWord content={word} />
            </li>
          ))}
        </Sentence>
      </div>
      <div className="answers-zone-wrapper">
        <DropZone dropName="answersZone" answerWords={answerWords} />
      </div>
      <div className="pending-zone-wrapper">
        <DropZone dropName="pendingZone" answerWords={answerWords} />
      </div>
      {isError && <ErrorMessage content="Something wrong!" />}
      <div className="quiz__btn-wrapper">
        <Button onclickHandler={console.log} content="click" />
      </div>
    </div>
  );
};

export default Quiz;
