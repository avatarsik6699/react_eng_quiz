import './Quiz.scss';
import React, { useCallback, useRef, useState } from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import SentenceWord from '../../atoms/SentenceWord/SentenceWord';
import Title from '../../atoms/Title/Title';
import DropZone from '../../molecules/DropZone/DropZone';
import Sentence from '../../molecules/Sentence/Sentence';
import { TRANSITION_TIME } from '../../settings/constants';
import { Coord } from './Quiz.types';
import {
  calcOriginCoords,
  getAnchorsCoords,
  getPreparedAnchors,
  getShiftedWords,
  getUpdatedAnswersAnchors,
} from '../../helpers/helpers';
import { AnchorElementType } from '../../atoms/Anchor/Anchor.types';
import { WordElementType } from '../../atoms/AnswerWord/AnswerWord.types';

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
const anchorsInPendingZone: AnchorElementType[] = [...Array(words.length).keys()].map(
  (anchorId) => ({
    anchorId,
    isHidden: false,
    answerId: null,
    isPrepared: false,
    isdisappear: false,
  })
);
const anchorsInAnswersZone: AnchorElementType[] = [...Array(words.length).keys()].map(
  (anchorId) => ({
    anchorId,
    answerId: null,
    isHidden: true,
    isPrepared: false,
    isdisappear: false,
  })
);

const Quiz = () => {
  const [isError, setError] = useState(false);
  const pendingRef = useRef<HTMLElement>();
  const answersRef = useRef<HTMLElement>();
  const isTransitioned = useRef(false);

  // origin-coords-------------------------------------------------------
  const [pendingOriginCoords, setPendingOriginCoords] = useState({});
  const [answersOriginCoords, setAnswersOriginCoords] = useState({});
  // words---------------------------------------------------------------
  const [wordsInPendingZone, setWordsInPendingZone] = useState<WordElementType[]>(words);
  const [wordsInAnswerZone, setWordsInAnswerZone] = useState<WordElementType[]>([]);
  // anchors-------------------------------------------------------------
  const [answersAnchors, setAnswersAnchors] = useState(anchorsInAnswersZone);
  const [pendingAnchors, setPendingAnchors] = useState(anchorsInPendingZone);
  // handler functions-------------------------------------------

  const dragStartHandler = useCallback(
    ({ dragId, from }) => {
      isTransitioned.current = false;
      if (from === 'pending') {
        setPendingOriginCoords({
          ...pendingOriginCoords,
          ...calcOriginCoords(pendingRef.current as HTMLElement, wordsInPendingZone, dragId),
        });
      } else {
        setAnswersOriginCoords({
          ...answersOriginCoords,
          ...calcOriginCoords(answersRef.current as HTMLElement, wordsInAnswerZone, dragId),
        });
      }
    },
    [answersOriginCoords, pendingOriginCoords, wordsInAnswerZone, wordsInPendingZone]
  );

  const dragMoveHandler = useCallback(
    ({ from, currentZone }) => {
      if (from === 'pending') {
        if (currentZone === 'answersZone')
          setAnswersAnchors(getUpdatedAnswersAnchors('show', answersAnchors, { target: 'hidden' }));
        else
          setAnswersAnchors(
            getUpdatedAnswersAnchors('hide', answersAnchors, { target: 'prepared' })
          );
      }
    },
    [answersAnchors]
  );

  const dragEndHandler = useCallback(
    ({ dragId, from, currentZone, originId }) => {
      if (from === 'pending') {
        if (currentZone === 'answersZone') {
          // ANIMATION------------------------------------
          const preparedAnchorId = [...answersAnchors].reverse().find((anchor) => anchor.isPrepared)
            ?.anchorId as number;

          const coordsTargetAnchor = getAnchorsCoords(
            getPreparedAnchors(answersRef.current as HTMLElement),
            preparedAnchorId
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

            // ADD WORD TO END OF ANSWERS AREA
            setWordsInAnswerZone([
              ...wordsInAnswerZone,
              { ...wordsInPendingZone[dragId], wordId: preparedAnchorId, from: 'answers' },
            ]);

            // SHIFT WORDS IN PENDING AREA-----------------------------------------
            setWordsInPendingZone(getShiftedWords([...wordsInPendingZone], dragId));

            // SET ACTIVE PREPARED ANCHOR IN ANSWER AREA---------------------------
            setAnswersAnchors(
              answersAnchors.map((anchor) =>
                anchor.anchorId === preparedAnchorId
                  ? { ...anchor, isPrepared: false, answerId: preparedAnchorId }
                  : anchor
              )
            );

            setPendingOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
          }, TRANSITION_TIME);
        } else {
          setPendingOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
        }
      } else {
        if (currentZone === 'pendingZone') {
          // ANIMATION------------------------------------
          const draggableElemCoords = getAnchorsCoords(
            getPreparedAnchors(answersRef.current as HTMLElement),
            dragId
          ) as Coord;
          const targetAnchorCoords = getAnchorsCoords(
            getPreparedAnchors(pendingRef.current as HTMLElement),
            originId
          ) as Coord;
          setAnswersOriginCoords({
            ...answersOriginCoords,
            [dragId]: {
              x: targetAnchorCoords.x - draggableElemCoords.x,
              y: targetAnchorCoords.y - draggableElemCoords.y,
            },
          });
          setPendingOriginCoords({
            ...pendingOriginCoords,
            ...calcOriginCoords(pendingRef.current as HTMLElement, wordsInPendingZone, originId, {
              includeCurrent: true,
              shiftDirection: 'right',
            }),
          });

          setTimeout(() => {
            isTransitioned.current = true;
            const draggableElem = wordsInAnswerZone[dragId];

            // SHIFT PENDING WORDS---------------------------------------------------------
            const shiftedPendingWords = getShiftedWords([...wordsInPendingZone], originId, {
              withDraggableElem: true,
              directionShift: 'right',
            });
            shiftedPendingWords.splice(originId, 0, {
              ...draggableElem,
              from: 'pending',
              wordId: originId,
            });
            setWordsInPendingZone([...shiftedPendingWords]);

            // SHIFT ANSWERS WORDS------------------------------------------------------
            const shiftedAnswersWords = getShiftedWords([...wordsInAnswerZone], dragId, {
              withDraggableElem: false,
              directionShift: 'left',
            });
            setWordsInAnswerZone([...shiftedAnswersWords]);

            // HIDE LAST ANCHOR IN ANSWER AREA--------------------------------------------
            setAnswersAnchors(getUpdatedAnswersAnchors('hide', answersAnchors, { target: 'last' }));

            // SET INITIAL ORIGIN COORDS {x: 0, y: 0}-----------------------
            setAnswersOriginCoords({});
            setPendingOriginCoords({});
          }, TRANSITION_TIME);
        } else {
          setAnswersOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
        }
      }
    },
    [
      answersAnchors,
      answersOriginCoords,
      pendingOriginCoords,
      wordsInAnswerZone,
      wordsInPendingZone,
    ]
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
