import { IAnchor } from '../../atoms/Anchor/Anchor.types';
import { IWord } from '../../atoms/AnswerWord/AnswerWord.types';
import { IOriginCoords } from './Quiz.types';
import { Translator } from '@eo-locale/core';
import locales from '../../locales';

const getCorrectWords = (language: 'ru' | 'en', target: 'answers' | 'correct', quizId: string): IWord[] => {
  const words = new Translator(language, locales).translate(`${quizId}.${target}`);
  return words.split(' ').map((text, index) => ({
    text,
    wordId: index,
    originId: index,
    from: 'waiting',
  }));
};

const getCorrectAnchors = (language: 'ru' | 'en', target: 'answers' | 'correct', quizId: string): IAnchor[] => {
  const words = new Translator(language, locales).translate(`${quizId}.${target}`);
  return words.split(' ').map((_, index) => ({
    anchorId: index,
    isHidden: target === 'answers',
    answerId: null,
    isPrepared: false,
  }));
};

const getCorrectText = (quizId: string) => {
  return new Translator('ru', locales).getMessageById(`${quizId}.correct`) as string;
};

const getQuestionText = (quizId: string) => {
  return new Translator('en', locales).getMessageById(`${quizId}.question`) as string;
};

const getConvertedAnchors = <R extends IAnchor[] | { [key: string]: IAnchor }>(
  anchors: R
): R extends IAnchor[] ? { [key: string]: IAnchor } : IAnchor[] =>
  Array.isArray(anchors)
    ? anchors.reduce((acc, anchor) => ({ ...acc, [anchor.anchorId]: { ...anchor } }), {})
    : Object.values(anchors);

const getConvertedWords = (words: IWord[]): { [key: string]: IWord } =>
  words.reduce((acc, word) => ({ ...acc, [word.wordId]: { ...word } }), {});

const getAnchorsDomList = <T extends HTMLElement>(anchorsDomRoot: T): T[] =>
  (Array.from(anchorsDomRoot.children) as T[]).reduce(
    (anchors: T[], anchor) =>
      anchor.children.length !== 0 && !anchor.children[0].matches('.answer-word')
        ? [...anchors, ...getAnchorsDomList(anchor)]
        : [...anchors, anchor],
    []
  );

const calcOriginCoords = (
  root: HTMLElement,
  idBeforeDraggableElem: number[],
  settings?: { direction: 'right' | 'left' }
) => {
  const { direction } = settings ?? { direction: 'left' }; //default settings
  const coords = getAnchorsDomCoords(root);
  return idBeforeDraggableElem.reduce(
    (originCoords: IOriginCoords, id) => ({
      ...originCoords,
      [id]: {
        x: coords[direction === 'right' ? (coords.length === id + 1 ? id : id + 1) : id - 1].x - coords[id].x, // overfloow
        y: coords[direction === 'right' ? (coords.length === id + 1 ? id : id + 1) : id - 1].y - coords[id].y, // overfloow
      },
    }),
    {}
  );
};

const getAnchorsDomCoords = (anchorsDomRoot: HTMLElement) =>
  getAnchorsDomList(anchorsDomRoot).map(anchor => ({
    x: anchor.getBoundingClientRect().x,
    y: anchor.getBoundingClientRect().y,
  }));

const getIdBeforeDraggableElem = (
  words: { wordsList: IWord[]; wordsArea: 'waiting' | 'answers' },
  draggableElem: IWord,
  action: 'put' | 'take'
) => {
  const { wordsList, wordsArea } = words;
  const isGap = (word: IWord) => {
    if (word.wordId - shiftedId > 1) {
      isBlocked = true;
      return false;
    } else {
      shiftedId += 1;
      return true;
    }
  };

  const isAnchorBusy =
    draggableElem.from === 'waiting' ? true : wordsList.find(word => word.wordId === draggableElem.originId);
  let isBlocked = isAnchorBusy ? false : true;
  let shiftedId = action === 'put' ? draggableElem.originId : draggableElem.wordId;
  const result = wordsList
    .filter(word => {
      if (wordsArea === 'waiting') {
        if (isBlocked) return false;
        if (action === 'put') {
          if (word.wordId >= draggableElem.originId) {
            return isGap(word);
          } else {
            return false;
          }
        } else {
          if (word.wordId > draggableElem.wordId) {
            return isGap(word);
          } else {
            return false;
          }
        }
      } else {
        return word.wordId > draggableElem.wordId;
      }
    })
    .map(word => word.wordId);
  return result;
};

const getUpdatedAnswersAnchors = (
  anchors: IAnchor[],
  action: 'setBusy' | 'delBusy' | 'prepare' | 'disprepare' | 'prepareLast'
) => {
  const convertedAnchors = getConvertedAnchors(anchors);
  let targetAnchor;
  switch (action) {
    case 'setBusy': {
      targetAnchor = [...anchors].reverse().find(anchor => anchor.isPrepared);
      break;
    }
    case 'delBusy': {
      targetAnchor = [...anchors].reverse().find(anchor => anchor.answerId !== null);
      break;
    }
    case 'disprepare': {
      targetAnchor = [...anchors].reverse().find(anchor => anchor.isPrepared && anchor.answerId === null);
      break;
    }
    case 'prepareLast': {
      targetAnchor = [...anchors].reverse().find(anchor => anchor.answerId !== null) as IAnchor;
      break;
    }
    default: {
      targetAnchor = anchors.find(anchor => anchor.answerId === null);
      break;
    }
  }

  // check undefined
  if (targetAnchor) {
    convertedAnchors[targetAnchor.anchorId] = {
      ...targetAnchor,
      isPrepared: action === 'prepare' || action === 'prepareLast',
      answerId: action === 'setBusy' || action === 'prepareLast' ? targetAnchor.anchorId : null,
    };
  }

  return getConvertedAnchors(convertedAnchors);
};

const getShiftedWords = (
  words: IWord[],
  dragId: number,
  idBeforeDraggableElem: number[],
  settings: { elementAction: 'remove' | 'add'; directionShift: 'left' | 'right' }
) => {
  const { elementAction, directionShift } = settings;

  const correctWords = elementAction === 'add' ? words : words.filter(word => word.wordId !== dragId);
  return correctWords.map(word =>
    idBeforeDraggableElem.includes(word.wordId)
      ? {
          ...word,
          wordId:
            directionShift === 'right'
              ? words.length === word.wordId // overfloow
                ? word.wordId
                : word.wordId + 1
              : word.wordId - 1,
        }
      : word
  );
};

export {
  calcOriginCoords,
  getAnchorsDomCoords,
  getIdBeforeDraggableElem,
  getShiftedWords,
  getUpdatedAnswersAnchors,
  getConvertedWords,
  getAnchorsDomList,
  getConvertedAnchors,
  getCorrectWords,
  getCorrectAnchors,
  getCorrectText,
  getQuestionText,
};
