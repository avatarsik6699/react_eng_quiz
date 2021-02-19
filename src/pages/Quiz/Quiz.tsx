import './Quiz.scss';
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import SentenceWord from '../../atoms/SentenceWord/SentenceWord';
import Title from '../../atoms/Title/Title';
import Sentence from '../../molecules/Sentence/Sentence';
import { INITIAL_DRAGGABLE_ID, TRANSITION_TIME } from '../../settings/constants';
import { IAnchor } from '../../atoms/Anchor/Anchor.types';
import { IWord } from '../../atoms/AnswerWord/AnswerWord.types';
import {
  calcOriginCoords,
  getAnchorsDomCoords,
  getConvertedWords,
  getCorrectAnchors,
  getCorrectWords,
  getIdBeforeDraggableElem,
  getShiftedWords,
  getUpdatedAnswersAnchors,
  getAnchorsDomList,
  getCorrectText,
  getQuestionText,
} from './Quiz.helpers';
import Message from '../../atoms/Message/Message';
import {
  IOriginCoords,
  IQuizProps,
  TDragEndHandler,
  TDraggableId,
  TDragMoveHandler,
  TDragStartHandler,
} from './Quiz.types';
import DropArea from '../../molecules/DropArea/DropArea';
const Quiz = ({ quizId }: IQuizProps) => {
  // result-info----------------------------------------------------------
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isError, setError] = useState<boolean | null>(null);

  // animation-data------------------------------------------------------
  const [isBlockAnimaton, setBlockAnimation] = useState(false);
  const [dragEndEvent, setDragEndEvent] = useState<string>('');
  const waitingRef = useRef() as RefObject<HTMLUListElement>;
  const answersRef = useRef() as RefObject<HTMLDivElement>;
  const isTransitioned = useRef(false);
  const [draggableId, setDraggableId] = useState<TDraggableId>(INITIAL_DRAGGABLE_ID);

  // origin-coords-------------------------------------------------------
  const [waitingOriginCoords, setWaitingOriginCoords] = useState<IOriginCoords>({});
  const [answersOriginCoords, setAnswersOriginCoords] = useState<IOriginCoords>({});
  // words---------------------------------------------------------------
  const [waitingWords, setWaitingWords] = useState<IWord[]>(getCorrectWords('ru', 'answers', quizId));
  const [answersWords, setAnswersWords] = useState<IWord[]>([]);
  // anchors-------------------------------------------------------------
  const [answersAnchors, setAnswersAnchors] = useState(getCorrectAnchors('ru', 'answers', quizId));

  // HELPER FUNCTIONS---------------------------------------------
  const getNewOriginCoords = useCallback(
    (target: 'waiting' | 'answers', dragId: number): IOriginCoords => {
      const prevOriginCoords = target === 'waiting' ? waitingOriginCoords : answersOriginCoords;
      const root = target === 'waiting' ? (waitingRef.current as HTMLElement) : (answersRef.current as HTMLElement);
      const idBeforeDraggableElem = getIdBeforeDraggableElem(
        {
          wordsList: target === 'waiting' ? waitingWords : answersWords,
          wordsArea: target,
        },
        getConvertedWords(target === 'waiting' ? waitingWords : answersWords)[dragId],
        'take'
      );
      const calculatedOriginCoords = calcOriginCoords(root, idBeforeDraggableElem);
      return {
        ...prevOriginCoords,
        ...calculatedOriginCoords,
      };
    },
    [answersOriginCoords, answersWords, waitingOriginCoords, waitingWords]
  );

  const getAnswerPreparedAnchor = useCallback(
    () => [...answersAnchors].reverse().find(anchor => anchor.isPrepared) as IAnchor,
    [answersAnchors]
  );

  const getEmptyAnswerAnchor = (anchors: IAnchor[]) => anchors.find(anchor => anchor.answerId === null) as IAnchor;

  const isTargetWaitingAnchorBusy = (currentArea: string, anchorId: number) =>
    currentArea === 'waitingAnchor' && getAnchorsDomList(waitingRef.current as HTMLUListElement)[anchorId].children[0];

  const resetOriginCoords = (time: number = 0) => {
    setAnswersOriginCoords({});
    setWaitingOriginCoords({});
    setTimeout(() => setBlockAnimation(false), time);
  };

  const translateDragElemFromPending = useCallback(
    (params: { anchorId: number; dragId: number }) => {
      const { anchorId, dragId } = params;
      const targetAnchorCoords = getAnchorsDomCoords(answersRef.current as HTMLElement)[anchorId];
      const draggableElemCoords = getAnchorsDomCoords(waitingRef.current as HTMLElement)[dragId];
      setWaitingOriginCoords({
        ...waitingOriginCoords,
        [dragId]: {
          x: targetAnchorCoords.x - draggableElemCoords.x,
          y: targetAnchorCoords.y - draggableElemCoords.y,
        },
      });
    },
    [waitingOriginCoords]
  );

  const translateDragElemFromAnswers = useCallback(
    (
      params: { dragId: number; anchorId: number },
      anchorsRoot: HTMLDivElement | HTMLUListElement = waitingRef.current as HTMLUListElement
    ) => {
      const { dragId, anchorId } = params;
      const draggableElemCoords = getAnchorsDomCoords(answersRef.current as HTMLElement)[dragId];
      const targetAnchorCoords = getAnchorsDomCoords(anchorsRoot)[anchorId];
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

  const translateWaitingWords = useCallback(
    (dragId: number) => {
      const idBeforeDraggableElem = getIdBeforeDraggableElem(
        { wordsList: waitingWords, wordsArea: 'waiting' },
        getConvertedWords(answersWords)[dragId],
        'put'
      );

      setWaitingOriginCoords({
        ...waitingOriginCoords,
        ...calcOriginCoords(waitingRef.current as HTMLElement, idBeforeDraggableElem, { direction: 'right' }),
      });
    },
    [answersWords, waitingOriginCoords, waitingWords]
  );

  // HANDLER FUNCTIONS---------------------------------------------
  const checkAnswerHandler = useCallback(() => {
    const correctText = getCorrectText(quizId);
    const answersText = answersWords.map(word => word.text).join(' ');

    if (correctText.localeCompare(answersText) === 0) {
      setResultMessage('is complete!!!');
    } else {
      setError(true);
      setResultMessage('something wrong');
    }
  }, [answersWords, quizId]);

  const dragStartHandler: TDragStartHandler = useCallback(
    ({ dragId, from }) => {
      isTransitioned.current = false; // enable transition
      setResultMessage(null);
      setError(null);
      if (from === 'waiting') {
        setWaitingOriginCoords(getNewOriginCoords('waiting', dragId));
      } else {
        setAnswersAnchors(getUpdatedAnswersAnchors(answersAnchors, 'prepareLast'));
        setAnswersOriginCoords(getNewOriginCoords('answers', dragId));
      }
    },
    [answersAnchors, getNewOriginCoords]
  );

  const dragMoveHandler: TDragMoveHandler = useCallback(
    ({ from, currentArea }) => {
      if (from === 'waiting') {
        if (currentArea === 'answersArea') setAnswersAnchors(getUpdatedAnswersAnchors(answersAnchors, 'prepare'));
        if (currentArea === 'out-answersArea') {
          setAnswersAnchors(getUpdatedAnswersAnchors(answersAnchors, 'disprepare'));
        }
      }
    },
    [answersAnchors]
  );

  const dragEndHandler: TDragEndHandler = useCallback(
    ({ dragId, from, currentArea, originId, anchorId }) => {
      setBlockAnimation(true); // disable handlers
      if (from === 'waiting') {
        if (currentArea === 'answersArea') {
          // ANIMATION-----------------------------------------
          translateDragElemFromPending({ anchorId: getEmptyAnswerAnchor(answersAnchors).anchorId, dragId });
          setDraggableId({ originId, wordId: dragId });
          setDragEndEvent('waiting-answers');
        } else {
          resetOriginCoords(100);
        }
      }

      if (from === 'answers') {
        const correctCurrentArea = isTargetWaitingAnchorBusy(currentArea, anchorId as number)
          ? 'waitingArea'
          : currentArea;
        if (correctCurrentArea === 'waitingArea') {
          // translate drag elem to pending
          translateDragElemFromAnswers({ dragId, anchorId: originId });

          // translate pending words
          const idBeforeDraggableElem = getIdBeforeDraggableElem(
            { wordsList: waitingWords, wordsArea: 'waiting' },
            getConvertedWords(answersWords)[dragId],
            'put'
          );
          setWaitingOriginCoords({
            ...waitingOriginCoords,
            ...calcOriginCoords(waitingRef.current as HTMLElement, idBeforeDraggableElem, { direction: 'right' }),
          });

          //UPDATE STATE----------------------------------
          setDraggableId({ originId, wordId: dragId });
          setDragEndEvent('answers-waiting');
        } else if (correctCurrentArea === 'waitingAnchor') {
          // TRANSLATE TO THE WRONG ANCHOR-----------------------------
          translateDragElemFromAnswers({ dragId, anchorId: anchorId as number });

          // TRANSLATE TO THE ORIGIN ANCHOR----------------------------
          setDraggableId({ wordId: dragId, originId: originId });
          setDragEndEvent('answers-wrong-waiting');
        } else {
          setBlockAnimation(true); // disable handlers

          translateDragElemFromAnswers(
            { dragId, anchorId: getAnswerPreparedAnchor().anchorId },
            answersRef.current as HTMLDivElement
          );
          setDraggableId({ originId, wordId: dragId });
          setDragEndEvent('answers-answers');
        }
      }
    },
    [
      translateDragElemFromPending,
      answersAnchors,
      translateDragElemFromAnswers,
      waitingWords,
      answersWords,
      waitingOriginCoords,
      getAnswerPreparedAnchor,
    ]
  );

  useEffect(() => {
    switch (dragEndEvent) {
      case 'waiting-answers': {
        setTimeout(() => {
          setDragEndEvent('');
          isTransitioned.current = true; // off transition

          // show last anchor in answers area
          setAnswersAnchors(getUpdatedAnswersAnchors(answersAnchors, 'setBusy'));

          // shift words in waiting area
          const idBeforeDraggableElem = getIdBeforeDraggableElem(
            { wordsList: waitingWords, wordsArea: 'waiting' },
            getConvertedWords(waitingWords)[draggableId.wordId],
            'take'
          );

          setWaitingWords(
            getShiftedWords(waitingWords, draggableId.wordId, idBeforeDraggableElem, {
              elementAction: 'remove',
              directionShift: 'left',
            })
          );

          // add word to end of answers area
          const targetWord = getConvertedWords(waitingWords)[draggableId.wordId];
          setAnswersWords([
            ...answersWords,
            { ...targetWord, wordId: getEmptyAnswerAnchor(answersAnchors).anchorId, from: 'answers' },
          ]);
          resetOriginCoords(100);
        }, TRANSITION_TIME);
        break;
      }
      case 'answers-waiting': {
        setTimeout(() => {
          setDragEndEvent('');
          isTransitioned.current = true; // off transition

          // shift waiting words
          const idBeforeDraggableElem = getIdBeforeDraggableElem(
            { wordsList: waitingWords, wordsArea: 'waiting' },
            getConvertedWords(answersWords)[draggableId.wordId],
            'put'
          );
          const shiftedwaitingWords = getShiftedWords(waitingWords, draggableId.originId, idBeforeDraggableElem, {
            elementAction: 'add',
            directionShift: 'right',
          });
          const convertedWords = getConvertedWords(shiftedwaitingWords);
          convertedWords[draggableId.originId] = {
            ...getConvertedWords(answersWords)[draggableId.wordId],
            from: 'waiting',
            wordId: draggableId.originId,
          };
          setWaitingWords(Object.values(convertedWords));

          // shift answers words
          const idBeforeAnswers = getIdBeforeDraggableElem(
            { wordsList: answersWords, wordsArea: 'answers' },
            getConvertedWords(answersWords)[draggableId.wordId],
            'take'
          );
          const shiftedAnswersWords = getShiftedWords(answersWords, draggableId.wordId, idBeforeAnswers, {
            elementAction: 'remove',
            directionShift: 'left',
          });
          setAnswersWords(shiftedAnswersWords);

          // hide last anchor in answers area
          setAnswersAnchors(getUpdatedAnswersAnchors(answersAnchors, 'delBusy'));

          resetOriginCoords(100);
        }, TRANSITION_TIME);
        break;
      }
      case 'answers-wrong-waiting': {
        setTimeout(() => {
          setDragEndEvent('');
          translateWaitingWords(draggableId.wordId);
          translateDragElemFromAnswers({ dragId: draggableId.wordId, anchorId: draggableId.originId });

          // UPDATE STATE---------------------------------------------
          setDragEndEvent('answers-waiting');
        }, TRANSITION_TIME + 500);
        break;
      }
      case 'answers-answers': {
        setTimeout(() => {
          setDragEndEvent('');
          isTransitioned.current = true; // off transition

          const targetWord = getConvertedWords(answersWords)[draggableId.wordId];
          const idBeforeDraggableElem = getIdBeforeDraggableElem(
            {
              wordsList: answersWords,
              wordsArea: 'answers',
            },
            targetWord,
            'take'
          );
          const shiftedAnswerWords = getShiftedWords(answersWords, draggableId.wordId, idBeforeDraggableElem, {
            elementAction: 'remove',
            directionShift: 'left',
          });
          shiftedAnswerWords.push({ ...targetWord, wordId: shiftedAnswerWords.length });

          setAnswersWords(shiftedAnswerWords);
          setAnswersAnchors(
            answersAnchors.map(anchor => (anchor.isPrepared ? { ...anchor, isPrepared: false } : anchor))
          );
          resetOriginCoords(100);
        }, TRANSITION_TIME);
        break;
      }
    }
  }, [
    answersAnchors,
    answersWords,
    dragEndEvent,
    draggableId,
    waitingWords,
    translateDragElemFromAnswers,
    translateWaitingWords,
  ]);

  return (
    <div className="quiz">
      <Title content="Translate this sentence" />
      <div className="quiz-info">
        <Avatar />
        <Sentence>
          {getQuestionText(quizId)
            .split(' ')
            .map((word, index) => (
              <li key={index}>
                <SentenceWord content={word} />
              </li>
            ))}
        </Sentence>
      </div>
      <div className="answers-wrapper">
        <DropArea
          dragStartHandler={dragStartHandler}
          dragMoveHandler={dragMoveHandler}
          dragEndHandler={dragEndHandler}
          originCoords={answersOriginCoords}
          areaName="answersArea"
          words={answersWords}
          anchors={answersAnchors}
          isTransitioned={isTransitioned.current}
          isBlockAnimaton={isBlockAnimaton}
          ref={answersRef}
        />
      </div>
      <div className="waiting-wrapper">
        <DropArea
          dragStartHandler={dragStartHandler}
          dragMoveHandler={dragMoveHandler}
          dragEndHandler={dragEndHandler}
          originCoords={waitingOriginCoords}
          areaName="waitingArea"
          words={waitingWords}
          anchors={getCorrectAnchors('ru', 'correct', quizId)}
          isTransitioned={isTransitioned.current}
          isBlockAnimaton={isBlockAnimaton}
          ref={waitingRef}
        />
      </div>
      <Message content={resultMessage} isError={isError} />
      <div className="btn-wrapper">
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
