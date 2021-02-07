import React, { useCallback, useRef, useState } from 'react';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
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
const anchorsInAnswersZone = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  answerId: null,
  isHidden: true,
  isPrepared: false,
}));

const Quiz = () => {
  const [isError, setError] = useState(false);
  const [anchorsApdated, setAnchorsApdated] = useState(false);
  const pendingRef = useRef<HTMLElement>();
  const answersRef = useRef<HTMLElement>();
  // origin-coords-------------------------------------------------------
  const [pendingOriginCoords, setPendingOriginCoords] = useState({});
  const [answersOriginCoords, setAnswersOriginCoords] = useState({});
  // words---------------------------------------------------------------
  const [wordsInPendingZone, setWordsInPendingZone] = useState(words);
  const [wordsInAnswerZone, setWordsInAnswerZone] = useState([]);
  // anchors-------------------------------------------------------------
  const [answersAnchors, setAnswersAnchors] = useState(anchorsInAnswersZone);
  const [pendingAnchors, setPendingAnchors] = useState(anchorsInPendingZone);

  // handler functions-------------------------------------------
  const dragStartHandler = useCallback(
    ({ dragId, from }) => {
      console.log(from, dragId);
      if (from === 'pending') {
        // setPendingOriginCoords({
        //   ...pendingOriginCoords,
        //   [dragId]: {
        //     x:
        //     y:
        //   }
        // })
        const getAnchorsCoords = () =>
          Array.from((pendingRef.current?.childNodes as unknown) as HTMLLIElement[]).map(
            (item) => ({
              x: item.getBoundingClientRect().x,
              y: item.getBoundingClientRect().y,
            })
          );
        const getElemsBeforeDraggableElem = (includeCurrent = false) =>
          wordsInPendingZone.filter((word) =>
            includeCurrent ? word.wordId >= dragId : word.wordId > dragId
          );
        const coords = getAnchorsCoords();
        const elemsBeforeDraggableElem = getElemsBeforeDraggableElem();
        const newOriginCoords = elemsBeforeDraggableElem.reduce(
          (origCoords, item) => ({
            ...origCoords,
            [item.wordId]: {
              x: coords[item.wordId - 1].x - coords[item.wordId].x,
              y: coords[item.wordId - 1].y - coords[item.wordId].y,
            },
          }),
          {}
        );
        console.log(newOriginCoords);
        setPendingOriginCoords({
          ...pendingOriginCoords,
          ...newOriginCoords,
        });
      } else {
      }
    },
    [pendingOriginCoords, wordsInPendingZone]
  );

  const dragMoveHandler = useCallback(
    ({ dragId, from, currentZone }) => {
      if (from === 'pending') {
        let itemFound = false;
        if (currentZone === 'answersZone') {
          const updatedAnswersAnchors = answersAnchors.map((anchor) => {
            if (anchor.isHidden && !itemFound) {
              console.log('if');
              itemFound = true;
              return { ...anchor, isPrepared: true, isHidden: false };
            }
            return anchor;
          });
          // setAnchorsApdated(true);
          setAnswersAnchors(updatedAnswersAnchors);
        } else {
          console.log('else');
          const updatedAnswersAnchors = answersAnchors
            .reverse()
            .map((anchor) => {
              if (anchor.isPrepared && !itemFound) {
                itemFound = true;
                return { ...anchor, isPrepared: false, isHidden: true };
              }
              return anchor;
            })
            .reverse();
          setAnswersAnchors(updatedAnswersAnchors);
        }
      }
    },
    [answersAnchors]
  );

  const dragEndHandler = useCallback(({ dragId, from, currentZone }) => {
    console.log(dragId, from, currentZone);
    if (from === 'pending') {
      if (currentZone !== 'answersZone') {
        setPendingOriginCoords({});
      } else {
        console.log('pending in answer zone');
      }
    }
  }, []);

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
