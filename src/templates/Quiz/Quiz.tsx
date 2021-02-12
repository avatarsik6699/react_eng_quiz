import './Quiz.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
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
import Message from '../../atoms/Message/Message';
const sentenceWords = ['He', 'eats', 'fish', 'at', 'home'];
const words = ['ест', 'он', 'дома', 'рыбу'].map((text, index) => ({
  text,
  wordId: index,
  originId: index,
  from: 'pending',
}));
const anchorsInPendingZone: AnchorElementType[] = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  isHidden: false,
  answerId: null,
  isPrepared: false,
}));
const anchorsInAnswersZone: AnchorElementType[] = [...Array(words.length).keys()].map((anchorId) => ({
  anchorId,
  answerId: null,
  isHidden: true,
  isPrepared: false,
}));

const Quiz = () => {
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isError, setError] = useState<boolean | null>(null);
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
  const resetOriginCoords = (time: number = 0) => {
    setAnswersOriginCoords({});
    setPendingOriginCoords({});
    setTimeout(() => setBlockAnimation(false), time);
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
    const correctText = 'он ест рыбу дома';
    const getAnswerText = () => answersWords.map((word) => word.text).join(' ');
    console.log();
    if (correctText === getAnswerText()) {
      setResultMessage('is complete!!!');
    } else {
      setError(true);
      setResultMessage('something wrong');
    }
  }, [answersWords]);

  const dragStartHandler = useCallback(
    ({ dragId, from }) => {
      // targetAnchorId.current = _getAnchorsDomList(answersRef.current as HTMLElement).findIndex(
      //   (item) => item.children.length === 0
      // );
      isTransitioned.current = false;
      setResultMessage(null);
      setError(null);
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
          setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'disprepare' }));
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
  console.log(answersAnchors);
  useEffect(() => {
    if (dragEndEvent === 'pending-answers') {
      setTimeout(() => {
        setDragEndEvent('');
        // off transition
        isTransitioned.current = true;

        // show last anchor in answers area
        setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'setBusy' }));

        // shift words in pending area
        const idBeforeDraggableElem = getIdBeforeDraggableElem(
          { wordsList: pendingWords, wordsArea: 'pending' },
          getConvertedWords(pendingWords)[draggingId.wordId],
          'take'
        );

        setPendingWords(
          getShiftedWords(pendingWords, draggingId.wordId, idBeforeDraggableElem, {
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
        resetOriginCoords(100);
      }, TRANSITION_TIME);
    }

    if (dragEndEvent === 'answers-pending') {
      setTimeout(() => {
        setDragEndEvent('');
        isTransitioned.current = true; // off transition

        // SHIFT PENDING WORDS---------------------------------------------------------
        const idBeforeDraggableElem = getIdBeforeDraggableElem(
          { wordsList: pendingWords, wordsArea: 'pending' },
          getConvertedWords(answersWords)[draggingId.wordId],
          'put'
        );
        const shiftedPendingWords = getShiftedWords(pendingWords, draggingId.originId, idBeforeDraggableElem, {
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
        setAnswersAnchors(getUpdatedAnswersAnchors({ anchors: answersAnchors, action: 'delBusy' }));

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
      <Message content={resultMessage} isError={isError} />
      <div className="quiz__btn-wrapper">
        <Button
          isTranslate={resultMessage}
          onclickHandler={isBlockAnimaton ? null : checkAnswerHandler}
          content="click"
        />
      </div>
    </div>
  );
};

export default Quiz;
