import React, { useCallback, useRef, useState } from 'react';
import { Anchor } from '../../atoms/Anchor/Anchor.types';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import SentenceWord from '../../atoms/SentenceWord/SentenceWord';
import Title from '../../atoms/Title/Title';
import {
  getAnchorsCoords,
  getElemsBeforeDraggableElem,
  getPreparedAnchors,
  getShiftedWords,
} from '../../helpers/helpers';
import DropZone from '../../molecules/DropZone/DropZone';
import { Word } from '../../molecules/DropZone/DropZone.types';
import Sentence from '../../molecules/Sentence/Sentence';
import { TRANSITION_TIME } from '../../settings/constants';

import './Quiz.scss';
import { Coord } from './Quiz.types';
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
const words = [
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
].map((text, index) => ({ text, wordId: index, originId: index, from: 'pending' }));
const anchorsInPendingZone = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  isHidden: false,
  isPrepared: false,
}));
const anchorsInAnswersZone: Anchor[] = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  answerId: null,
  isHidden: true,
  isPrepared: false,
}));

const Quiz = () => {
  const [isError, setError] = useState(false);
  const pendingRef = useRef<HTMLElement>();
  const answersRef = useRef<HTMLElement>();
  const isTransitioned = useRef(false);
  // origin-coords-------------------------------------------------------
  const [pendingOriginCoords, setPendingOriginCoords] = useState({});
  const [answersOriginCoords, setAnswersOriginCoords] = useState({});
  // words---------------------------------------------------------------
  const [wordsInPendingZone, setWordsInPendingZone] = useState<Word[]>(words);
  const [wordsInAnswerZone, setWordsInAnswerZone] = useState<Word[]>([]);
  // anchors-------------------------------------------------------------
  const [answersAnchors, setAnswersAnchors] = useState(anchorsInAnswersZone);
  const [pendingAnchors, setPendingAnchors] = useState(anchorsInPendingZone);
  // handler functions-------------------------------------------

  const dragStartHandler = useCallback(
    ({ dragId, from }) => {
      isTransitioned.current = false;
      if (from === 'pending') {
        const anchorsCoods = getAnchorsCoords(
          getPreparedAnchors(pendingRef.current as HTMLElement)
        ) as Coord[];
        const updatedPendingOriginCoords = getElemsBeforeDraggableElem(
          wordsInPendingZone,
          dragId
        ).reduce(
          (origCoords, item) => ({
            ...origCoords,
            [item.wordId]: {
              x: anchorsCoods[item.wordId - 1].x - anchorsCoods[item.wordId].x,
              y: anchorsCoods[item.wordId - 1].y - anchorsCoods[item.wordId].y,
            },
          }),
          {}
        );
        setPendingOriginCoords({
          ...pendingOriginCoords,
          ...updatedPendingOriginCoords,
        });
      }
    },
    [pendingOriginCoords, wordsInPendingZone]
  );

  const dragMoveHandler = useCallback(
    ({ from, currentZone, dragId }) => {
      const getUpdatedAnswersAnchors = (action: 'show' | 'hide' = 'show') => {
        const updatedAnswersAnchors = [...answersAnchors];
        const targetAnchor = updatedAnswersAnchors.find((anchor) =>
          action === 'show'
            ? anchor.isHidden && anchor.answerId === null
            : anchor.isPrepared && anchor.answerId === null
        ) as Anchor;

        if (targetAnchor) {
          updatedAnswersAnchors.splice(targetAnchor.anchorId, 1, {
            ...targetAnchor,
            isHidden: action === 'hide',
            isPrepared: action === 'show',
            // answerId: action === 'show' ? targetAnchor.anchorId : null,
          });
        }
        return updatedAnswersAnchors;
      };

      if (from === 'pending') {
        if (currentZone === 'answersZone') setAnswersAnchors(getUpdatedAnswersAnchors('show'));
        else if (currentZone === 'out') setAnswersAnchors(getUpdatedAnswersAnchors('hide'));
      }
    },
    [answersAnchors]
  );

  const dragEndHandler = useCallback(
    ({ dragId, from, currentZone }) => {
      if (from === 'pending') {
        if (currentZone !== 'answersZone') {
          setPendingOriginCoords({});
        } else {
          // Animation
          const targetAnchorId = [...answersAnchors].reverse().find((anchor) => anchor.isPrepared)
            ?.anchorId as number;
          const coordsTargetAnchor = getAnchorsCoords(
            getPreparedAnchors(answersRef.current as HTMLElement),
            targetAnchorId
          ) as Coord;
          const coordsDragElem = getAnchorsCoords(
            getPreparedAnchors(pendingRef.current as HTMLElement),
            dragId
          ) as Coord;
          setPendingOriginCoords({
            ...pendingOriginCoords,
            [dragId]: {
              x: coordsTargetAnchor.x - coordsDragElem.x,
              y: coordsTargetAnchor.y - coordsDragElem.y,
            },
          });
          setTimeout(() => {
            isTransitioned.current = true;
            const updatedAnswerAnchor = answersAnchors.find(
              (anchor) => anchor.anchorId === targetAnchorId
            ) as Anchor;
            const updatedAnswersAnchors = [...answersAnchors];
            updatedAnswersAnchors.splice(targetAnchorId, 1, {
              ...updatedAnswerAnchor,
              isPrepared: false,
              answerId: targetAnchorId,
            });

            const draggableElem = wordsInPendingZone[dragId];
            const updatedPendingWords = getShiftedWords([...wordsInPendingZone], dragId);
            const updatedAnswersWords = [
              ...wordsInAnswerZone,
              { ...draggableElem, wordId: targetAnchorId, from: 'answers' },
            ];

            setWordsInAnswerZone([...updatedAnswersWords]);
            setWordsInPendingZone([...updatedPendingWords]);
            setAnswersAnchors([...updatedAnswersAnchors]);
            setPendingOriginCoords({});
          }, TRANSITION_TIME);
        }
      } else {
        // from = 'answers'
      }
    },
    [answersAnchors, pendingOriginCoords, wordsInAnswerZone, wordsInPendingZone]
  );

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
        <DropZone
          dragStartHandler={dragStartHandler}
          dragMoveHandler={dragMoveHandler}
          dragEndHandler={dragEndHandler}
          originCoords={answersOriginCoords}
          dropName="answersZone"
          link={answersRef}
          words={wordsInAnswerZone}
          anchors={answersAnchors}
          isTransitioned={isTransitioned.current}
        />
      </div>
      <div className="pending-zone-wrapper">
        <DropZone
          dragStartHandler={dragStartHandler}
          dragMoveHandler={dragMoveHandler}
          dragEndHandler={dragEndHandler}
          originCoords={pendingOriginCoords}
          dropName="pendingZone"
          link={pendingRef}
          words={wordsInPendingZone}
          anchors={pendingAnchors}
          isTransitioned={isTransitioned.current}
        />
      </div>
      {isError && <ErrorMessage content="Something wrong!" />}
      <div className="quiz__btn-wrapper">
        <Button onclickHandler={console.log} content="click" />
      </div>
    </div>
  );
};

export default Quiz;
