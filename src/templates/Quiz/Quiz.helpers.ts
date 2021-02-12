import { AnchorElementType } from '../../atoms/Anchor/Anchor.types';
import { WordElementType } from '../../atoms/AnswerWord/AnswerWord.types';
import { Coord } from './Quiz.types';
interface IOriginCoords {
  [key: string]: Coord;
}

const getConvertedWords = (words: WordElementType[]): { [key: string]: WordElementType } =>
  words.reduce((acc, word) => ({ ...acc, [word.wordId]: { ...word } }), {});

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
        x: coords[direction === 'right' ? id + 1 : id - 1].x - coords[id].x,
        y: coords[direction === 'right' ? id + 1 : id - 1].y - coords[id].y,
      },
    }),
    {}
  );
};

const getAnchorsDomCoords = (anchorsDomRoot: HTMLElement) =>
  _getAnchorsDomList(anchorsDomRoot).map((anchor) => ({
    x: anchor.getBoundingClientRect().x,
    y: anchor.getBoundingClientRect().y,
  }));

const getIdBeforeDraggableElem = (
  words: { wordsList: WordElementType[]; wordsArea: 'pending' | 'answers' }, // слова которые надо перестроить
  draggableElem: WordElementType, // переносимое слово
  action: 'put' | 'take' // кладем или берем слово
) => {
  const { wordsList, wordsArea } = words;
  const isGap = (word: WordElementType) => {
    if (word.wordId - shiftedId > 1) {
      isBlocked = true;
      return false;
    } else {
      shiftedId += 1;
      return true;
    }
  };

  // определяем есть ли кто то на месте только когда двигаемся из answerArea
  const isAnchorBusy =
    draggableElem.from === 'pending' ? true : wordsList.find((word) => word.wordId === draggableElem.originId);
  let isBlocked = isAnchorBusy ? false : true;
  let shiftedId = action === 'put' ? draggableElem.originId : draggableElem.wordId;
  console.log(isAnchorBusy, 'IDBEFOREDRAG');
  return wordsList
    .filter((word) => {
      if (wordsArea === 'pending') {
        if (isBlocked) return false; // если есть разрыв / на месте originId пусто
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
    .map((word) => word.wordId);
};

const getUpdatedAnswersAnchors = (params: {
  anchors: AnchorElementType[];
  action: 'setBusy' | 'delBusy' | 'prepare' | 'disprepare';
}) => {
  const { action, anchors } = params;
  const convertedAnchors = _getConvertedAnchors(anchors);
  let targetAnchor;
  if (action === 'setBusy') {
    targetAnchor = [...anchors].reverse().find((anchor) => anchor.isPrepared);
  } else if (action === 'delBusy') {
    targetAnchor = [...anchors].reverse().find((anchor) => anchor.answerId !== null);
  } else if (action === 'disprepare') {
    targetAnchor = [...anchors].reverse().find((anchor) => anchor.isPrepared && anchor.answerId === null);
  } else {
    targetAnchor = anchors.find((anchor) => anchor.answerId === null);
  }

  // проверка на undefined
  if (targetAnchor) {
    convertedAnchors[targetAnchor.anchorId] = {
      ...targetAnchor,
      isPrepared: action === 'prepare',
      answerId: action === 'setBusy' ? targetAnchor.anchorId : null,
    };
  }

  return _getConvertedAnchors(convertedAnchors);
};

const getShiftedWords = (
  words: WordElementType[],
  dragId: number,
  idBeforeDraggableElem: number[],
  settings: { elementAction: 'remove' | 'add'; directionShift: 'left' | 'right' }
) => {
  const { elementAction, directionShift } = settings;
  console.log(idBeforeDraggableElem);
  // если слово убирается из words, то удаляем его из words и сдвигаем только слова, расположенные правее
  const correctWords = elementAction === 'add' ? words : words.filter((word) => word.wordId !== dragId);
  return correctWords.map((word) =>
    idBeforeDraggableElem.includes(word.wordId)
      ? { ...word, wordId: directionShift === 'right' ? word.wordId + 1 : word.wordId - 1 }
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
  _getAnchorsDomList,
};

// PRIVATE FUNCTIONS-------------------------------------------------------------
const _getAnchorsDomList = <T extends HTMLElement>(anchorsDomRoot: T): T[] =>
  (Array.from(anchorsDomRoot.children) as T[]).reduce(
    (anchors: T[], anchor) =>
      anchor.children.length !== 0 && !anchor.children[0].matches('.answer-word')
        ? [...anchors, ..._getAnchorsDomList(anchor)]
        : [...anchors, anchor],
    []
  );

type AnchorsObj = { [key: string]: AnchorElementType };
type AnchorArr = AnchorElementType[];

const _getConvertedAnchors = <R extends AnchorArr | AnchorsObj>(
  anchors: R
): R extends AnchorArr ? AnchorsObj : AnchorArr =>
  Array.isArray(anchors)
    ? anchors.reduce((acc, anchor) => ({ ...acc, [anchor.anchorId]: { ...anchor } }), {})
    : Object.values(anchors);
