import './Quiz.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import SentenceWord from '../../atoms/SentenceWord/SentenceWord';
import Title from '../../atoms/Title/Title';
import DropZone from '../../molecules/DropZone/DropZone';
import Sentence from '../../molecules/Sentence/Sentence';
import { TRANSITION_TIME } from '../../settings/constants';
import { AnchorElementType } from '../../atoms/Anchor/Anchor.types';
import { WordElementType } from '../../atoms/AnswerWord/AnswerWord.types';
import {
  calcOriginCoords,
  getAnchorsDomCoords,
  getConvertedWords,
  getIdBeforeDraggableElem,
  getShiftedWords,
  getUpdatedAnswersAnchors,
  _getAnchorsDomList,
} from './Quiz.helpers';

const sentenceWords = ['She', 'is', 'eating', 'an', 'apple', 'and', 'and', 'they', 'are', 'eating', 'bread'];
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
const anchorsInPendingZone: AnchorElementType[] = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  isHidden: false,
  answerId: null,
  isPrepared: false,
  isdisappear: false,
}));
const anchorsInAnswersZone: AnchorElementType[] = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  answerId: null,
  isHidden: true,
  isPrepared: false,
  isdisappear: false,
}));

const Quiz = () => {
  const [isError, setError] = useState(false);
  const [isBlockAnimaton, setBlockAnimation] = useState(false);
  const [draggingId, setDraggingId] = useState<{ originId: number; wordId: number }>({
    originId: 0,
    wordId: 0,
  });
  const [dragEndEvent, setDragEndEvent] = useState<string>('');

  const pendingRef = useRef<HTMLElement>();
  const answersRef = useRef<HTMLElement>();
  const isTransitioned = useRef(false);
  // const targetAnchorId = useRef<number>();

  // origin-coords-------------------------------------------------------
  const [pendingOriginCoords, setPendingOriginCoords] = useState({});
  const [answersOriginCoords, setAnswersOriginCoords] = useState({});
  // words---------------------------------------------------------------
  const [pendingWords, setPendingWords] = useState<WordElementType[]>(words);
  const [answersWords, setAnswersWords] = useState<WordElementType[]>([]);
  // anchors-------------------------------------------------------------
  const [answersAnchors, setAnswersAnchors] = useState(anchorsInAnswersZone);
  const [pendingAnchors, setPendingAnchors] = useState(anchorsInPendingZone);

  // HELPER FUNCTIONS---------------------------------------------
  const getTargetAnswersAnchorId = (anchors: AnchorElementType[]) =>
    anchors.find((anchor) => anchor.answerId === null)?.anchorId as number;

  const clearBlockAnimation = (time: number = TRANSITION_TIME) => {
    console.log('clear');
    setTimeout(() => setBlockAnimation(false), time);
  };
  const resetOriginCoords = () => {
    setAnswersOriginCoords({});
    setPendingOriginCoords({});
    setBlockAnimation(false);
  };

  const translateDragElemFromPending = useCallback(
    (params: { anchorId: number; dragId: number }) => {
      const { anchorId, dragId } = params;
      const targetAnchorCoords = getAnchorsDomCoords(answersRef.current as HTMLElement)[anchorId];
      const draggableElemCoords = getAnchorsDomCoords(pendingRef.current as HTMLElement)[dragId];
      setPendingOriginCoords({
        ...pendingOriginCoords,
        [dragId]: {
          x: targetAnchorCoords.x - draggableElemCoords.x,
          y: targetAnchorCoords.y - draggableElemCoords.y,
        },
      });
    },
    [pendingOriginCoords]
  );

  const translateDragElemFromAnswers = useCallback(
    (params: { dragId: number; anchorId: number }) => {
      const { dragId, anchorId } = params;
      const draggableElemCoords = getAnchorsDomCoords(answersRef.current as HTMLElement)[dragId];
      const targetAnchorCoords = getAnchorsDomCoords(pendingRef.current as HTMLElement)[anchorId];
      setAnswersOriginCoords({
        ...answersOriginCoords,
        [dragId]: {
          x: targetAnchorCoords.x - draggableElemCoords.x,
          y: targetAnchorCoords.y - draggableElemCoords.y,
        },
      });
    },
    [answersOriginCoords]
  );

  const translatePendingWords = useCallback(
    (dragId: number) => {
      const idBeforeDraggableElem = getIdBeforeDraggableElem(
        { wordsList: pendingWords, wordsArea: 'pending' },
        getConvertedWords(answersWords)[dragId],
        'put'
      );

      setPendingOriginCoords({
        ...pendingOriginCoords,
        ...calcOriginCoords(pendingRef.current as HTMLElement, idBeforeDraggableElem, { direction: 'right' }),
      });
    },
    [answersWords, pendingOriginCoords, pendingWords]
  );

  // HANDLER FUNCTIONS---------------------------------------------
  const checkAnswerHandler = useCallback(() => {
    console.log('kek');
  }, []);

  const dragStartHandler = useCallback(
    ({ dragId, from }) => {
      // targetAnchorId.current = _getAnchorsDomList(answersRef.current as HTMLElement).findIndex(
      //   (item) => item.children.length === 0
      // );
      isTransitioned.current = false;
      if (from === 'pending') {
        setPendingOriginCoords({
          ...pendingOriginCoords,
          ...calcOriginCoords(
            pendingRef.current as HTMLElement,
            getIdBeforeDraggableElem(
              { wordsList: pendingWords, wordsArea: 'pending' },
              getConvertedWords(pendingWords)[dragId],
              'take'
            )
          ),
        });
      } else
        setAnswersOriginCoords({
          ...answersOriginCoords,
          ...calcOriginCoords(
            answersRef.current as HTMLElement,
            getIdBeforeDraggableElem(
              { wordsList: answersWords, wordsArea: 'answers' },
              getConvertedWords(answersWords)[dragId],
              'take'
            )
          ),
        });
    },
    [answersOriginCoords, answersWords, pendingOriginCoords, pendingWords]
  );

  const dragMoveHandler = useCallback(
    ({ from, currentZone }) => {
      if (from === 'pending') {
        if (currentZone === 'answersZone')
          setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'prepare' }));
        if (currentZone === 'out-answersZone') {
          setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'hide' }));
        }
        // targetAnchorId.current = undefined;
      }
    },
    [answersAnchors]
  );

  const dragEndHandler = useCallback(
    ({ dragId, from, currentZone, originId, anchorId }) => {
      setBlockAnimation(true); // disable handlers
      if (from === 'pending') {
        if (currentZone === 'answersZone') {
          // ANIMATION-----------------------------------------
          translateDragElemFromPending({ anchorId: getTargetAnswersAnchorId(answersAnchors), dragId });
          setDraggingId({ originId, wordId: dragId });
          setDragEndEvent('pending-answers');
        } else {
          clearBlockAnimation(100);
          setPendingOriginCoords({});
        }
      }

      if (from === 'answers') {
        if (currentZone === 'pendingZone') {
          setBlockAnimation(true); // disable handlers
          // ANIMATION--------------------------------------
          // translate drag elem to pending
          translateDragElemFromAnswers({ dragId, anchorId: originId });

          // translate pending words
          const idBeforeDraggableElem = getIdBeforeDraggableElem(
            { wordsList: pendingWords, wordsArea: 'pending' },
            getConvertedWords(answersWords)[dragId],
            'put'
          );
          setPendingOriginCoords({
            ...pendingOriginCoords,
            ...calcOriginCoords(pendingRef.current as HTMLElement, idBeforeDraggableElem, { direction: 'right' }),
          });

          //UPDATE STATE----------------------------------
          setDraggingId({ originId, wordId: dragId });
          setDragEndEvent('answers-pending');
        } else if (currentZone === 'pendingAnchor') {
          // TRANSLATE TO THE WRONG ANCHOR-----------------------------
          translateDragElemFromAnswers({ dragId, anchorId });

          // TRANSLATE TO THE ORIGIN ANCHOR----------------------------
          setDraggingId({ wordId: dragId, originId: originId });
          setDragEndEvent('answers-wrong-pending');
        } else {
          clearBlockAnimation();
          setAnswersOriginCoords({});
        }
      }
    },
    [
      answersAnchors,
      answersWords,
      pendingOriginCoords,
      pendingWords,
      translateDragElemFromAnswers,
      translateDragElemFromPending,
    ]
  );

  useEffect(() => {
    if (dragEndEvent === 'pending-answers') {
      setTimeout(() => {
        setDragEndEvent('');
        // off transition
        isTransitioned.current = true;

        // show last anchor in answers area
        setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'show' }));

        // shift words in pending area
        const pendingBeforeId = getIdBeforeDraggableElem(
          { wordsList: pendingWords, wordsArea: 'pending' },
          getConvertedWords(pendingWords)[draggingId.wordId],
          'take'
        );

        setPendingWords(
          getShiftedWords(pendingWords, draggingId.wordId, pendingBeforeId, {
            elementAction: 'remove',
            directionShift: 'left',
          })
        );

        // add word to end of answers area
        const targetWord = getConvertedWords(pendingWords)[draggingId.wordId];
        setAnswersWords([
          ...answersWords,
          { ...targetWord, wordId: getTargetAnswersAnchorId(answersAnchors), from: 'answers' },
        ]);

        // reset origin coords / handlers
        // setPendingOriginCoords({});
        // clearBlockAnimation(100);
        resetOriginCoords();
      }, TRANSITION_TIME);
    }

    if (dragEndEvent === 'answers-pending') {
      setTimeout(() => {
        setDragEndEvent('');
        isTransitioned.current = true; // off transition

        // SHIFT PENDING WORDS---------------------------------------------------------
        const idBeforePending = getIdBeforeDraggableElem(
          { wordsList: pendingWords, wordsArea: 'pending' },
          getConvertedWords(answersWords)[draggingId.wordId],
          'put'
        );
        const shiftedPendingWords = getShiftedWords(pendingWords, draggingId.originId, idBeforePending, {
          elementAction: 'add',
          directionShift: 'right',
        });
        const convertedWords = getConvertedWords(shiftedPendingWords);
        convertedWords[draggingId.originId] = {
          ...getConvertedWords(answersWords)[draggingId.wordId],
          from: 'pending',
          wordId: draggingId.originId,
        };
        setPendingWords(Object.values(convertedWords));

        // SHIFT ANSWERS WORDS------------------------------------------------------
        const idBeforeAnswers = getIdBeforeDraggableElem(
          { wordsList: answersWords, wordsArea: 'answers' },
          getConvertedWords(answersWords)[draggingId.wordId],
          'take'
        );
        const shiftedAnswersWords = getShiftedWords(answersWords, draggingId.wordId, idBeforeAnswers, {
          elementAction: 'remove',
          directionShift: 'left',
        });
        setAnswersWords(shiftedAnswersWords);

        // HIDE LAST ANCHOR IN ANSWER AREA--------------------------------------------
        setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'hide' }));

        // SET INITIAL ORIGIN COORDS
        resetOriginCoords();
      }, TRANSITION_TIME);
    }

    if (dragEndEvent === 'answers-wrong-pending') {
      setTimeout(() => {
        setDragEndEvent('');
        translatePendingWords(draggingId.wordId);
        translateDragElemFromAnswers({ dragId: draggingId.wordId, anchorId: draggingId.originId });

        // UPDATE STATE---------------------------------------------
        setDragEndEvent('answers-pending');
      }, TRANSITION_TIME + 500);
    }
  }, [
    answersAnchors,
    answersWords,
    dragEndEvent,
    draggingId,
    pendingWords,
    translateDragElemFromAnswers,
    translatePendingWords,
  ]);

  console.log(answersWords, pendingWords);
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
          words={answersWords}
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
          words={pendingWords}
          anchors={pendingAnchors}
          isTransitioned={isTransitioned.current}
          isBlockAnimaton={isBlockAnimaton}
        />
      </div>
      {isError && <ErrorMessage content="Something wrong!" />}
      <div className="quiz__btn-wrapper">
        <Button onclickHandler={isBlockAnimaton ? null : checkAnswerHandler} content="click" />
      </div>
    </div>
  );
};

export default Quiz;
