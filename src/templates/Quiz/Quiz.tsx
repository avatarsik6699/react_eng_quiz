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
  'sie1',
  'sie2',
  'sie3',
  'sie4',
  'sie5',
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
  const [isBlockAnimaton, setBlockAnimation] = useState(false);
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

  const clearBlockAnimation = () => setTimeout(() => setBlockAnimation(false), TRANSITION_TIME);

  const dragStartHandler = useCallback(
    ({ dragId, from }) => {
      isTransitioned.current = false;
      if (from === 'pending') {
        setPendingOriginCoords({
          ...pendingOriginCoords,
          ...calcOriginCoords(
            pendingRef.current as HTMLElement,
            'pending',
            wordsInPendingZone,
            dragId
          ),
        });
      } else {
        setAnswersOriginCoords({
          ...answersOriginCoords,
          ...calcOriginCoords(
            answersRef.current as HTMLElement,
            'answers',
            wordsInAnswerZone,
            dragId
          ),
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
    ({ dragId, from, currentZone, originId, anchorId }) => {
      setBlockAnimation(true);
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
            setWordsInPendingZone(getShiftedWords([...wordsInPendingZone], dragId, 'pending'));

            // SET ACTIVE PREPARED ANCHOR IN ANSWER AREA---------------------------
            setAnswersAnchors(
              answersAnchors.map((anchor) =>
                anchor.anchorId === preparedAnchorId
                  ? { ...anchor, isPrepared: false, answerId: preparedAnchorId }
                  : anchor
              )
            );

            setPendingOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
            setBlockAnimation(false);
          }, TRANSITION_TIME);
        } else if (currentZone === 'pendingAnchor') {
          setPendingOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
          clearBlockAnimation();
        } else {
          setPendingOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
          clearBlockAnimation();
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
            ...calcOriginCoords(
              pendingRef.current as HTMLElement,
              'pending',
              wordsInPendingZone,
              originId,
              {
                includeCurrent: true,
                shiftDirection: 'right',
              }
            ),
          });

          setTimeout(() => {
            isTransitioned.current = true;
            const draggableElem = wordsInAnswerZone[dragId];

            // SHIFT PENDING WORDS---------------------------------------------------------
            const shiftedPendingWords = getShiftedWords(
              [...wordsInPendingZone],
              originId,
              'pending',
              {
                withDraggableElem: true,
                directionShift: 'right',
              }
            );
            shiftedPendingWords.splice(originId, 0, {
              ...draggableElem,
              from: 'pending',
              wordId: originId,
            });
            setWordsInPendingZone([...shiftedPendingWords]);

            // SHIFT ANSWERS WORDS------------------------------------------------------
            const shiftedAnswersWords = getShiftedWords([...wordsInAnswerZone], dragId, 'answers', {
              withDraggableElem: false,
              directionShift: 'left',
            });
            setWordsInAnswerZone([...shiftedAnswersWords]);

            // HIDE LAST ANCHOR IN ANSWER AREA--------------------------------------------
            setAnswersAnchors(getUpdatedAnswersAnchors('hide', answersAnchors, { target: 'last' }));

            // SET INITIAL ORIGIN COORDS {x: 0, y: 0}-----------------------
            setAnswersOriginCoords({});
            setPendingOriginCoords({});
            setBlockAnimation(false);
          }, TRANSITION_TIME);
        } else if (currentZone === 'pendingAnchor') {
          // БАГ - ОТСУТСТВУЮТ ЗАЗОРЫ -> ЭЛЕМЕНТ СМЕЩАЕТСЯ
          // TRANSLATE TO THE WRONG ANCHOR-------------------------
          const targetAnchorCoords = getAnchorsCoords(
            getPreparedAnchors(pendingRef.current as HTMLLIElement),
            anchorId
          ) as Coord;
          const draggableElemCoords = getAnchorsCoords(
            getPreparedAnchors(answersRef.current as HTMLLIElement),
            dragId
          ) as Coord;

          setAnswersOriginCoords({
            ...answersOriginCoords,
            [dragId]: {
              x: targetAnchorCoords.x - draggableElemCoords.x,
              y: targetAnchorCoords.y - draggableElemCoords.y,
            },
          });

          // TRANSLATE TO ORIGIN ANCHOR--------------------------------
          setTimeout(() => {
            // VISUAL SHIFT OF THE WORDS IN PENDING AREA
            setPendingOriginCoords({
              ...pendingOriginCoords,
              ...calcOriginCoords(
                pendingRef.current as HTMLElement,
                'pending',
                wordsInPendingZone,
                originId,
                {
                  includeCurrent: true,
                  shiftDirection: 'right',
                }
              ),
            });

            // VISUAL TRANSLATE OF THE DRAGGABLE ELEM TO ORIGIN ANCHOR
            const originAnchorCoords = getAnchorsCoords(
              getPreparedAnchors(pendingRef.current as HTMLLIElement),
              originId
            ) as Coord;

            setAnswersOriginCoords({
              ...answersOriginCoords,
              [dragId]: {
                x: originAnchorCoords.x - draggableElemCoords.x,
                y: originAnchorCoords.y - draggableElemCoords.y,
              },
            });

            // UPDATE BOTH AREA
            setTimeout(() => {
              isTransitioned.current = true;
              const draggableElem = wordsInAnswerZone[dragId];
              // SHIFT PENDING WORDS---------------------------------------------------------
              const shiftedPendingWords = getShiftedWords(
                [...wordsInPendingZone],
                originId,
                'pending',
                {
                  withDraggableElem: true,
                  directionShift: 'right',
                }
              );

              shiftedPendingWords.splice(originId, 0, {
                ...draggableElem,
                from: 'pending',
                wordId: originId,
              });

              // SHIFT ANSWERS WORDS------------------------------------------------------
              const shiftedAnswersWords = getShiftedWords(
                [...wordsInAnswerZone],
                dragId,
                'answers',
                {
                  withDraggableElem: false,
                  directionShift: 'left',
                }
              );
              setWordsInAnswerZone([...shiftedAnswersWords]);

              // HIDE LAST ANCHOR IN ANSWER AREA--------------------------------------------
              setAnswersAnchors(
                getUpdatedAnswersAnchors('hide', answersAnchors, { target: 'last' })
              );
              setWordsInPendingZone([...shiftedPendingWords]);
              // SET INITIAL ORIGIN COORDS {x: 0, y: 0}-----------------------
              setAnswersOriginCoords({});
              setPendingOriginCoords({});
              setBlockAnimation(false);
            }, TRANSITION_TIME);
          }, TRANSITION_TIME + 500);
        } else {
          setAnswersOriginCoords({}); // SET INITIAL ORIGIN COORDS {x: 0, y: 0}
          clearBlockAnimation();
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
  console.log(wordsInAnswerZone, wordsInPendingZone);
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
          isBlockAnimaton={isBlockAnimaton}
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
          isBlockAnimaton={isBlockAnimaton}
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
