import { AnchorElementType } from '../atoms/Anchor/Anchor.types';
import { WordElementType } from '../atoms/AnswerWord/AnswerWord.types';
import { Coord } from '../templates/Quiz/Quiz.types';

const getElemsBeforeDraggableElem = (
  words: WordElementType[],
  dragId: number,
  area: 'pending' | 'answers',
  includeCurrent = false
) => {
  let isGap = false;
  if (area === 'pending') {
    return words.filter((word, index) => {
      if (word.wordId > dragId && !isGap) {
        if (Math.abs(index - 1 - word.wordId) > 1) {
          isGap = true;
          return false;
        } else {
          return true;
        }
      } else {
        return includeCurrent && word.wordId === dragId;
      }
    });
  } else {
    return words.filter((word) => (includeCurrent ? word.wordId >= dragId : word.wordId > dragId));
  }
};

const getPreparedAnchors = (anchorsRoot: HTMLElement): HTMLElement[] =>
  (Array.from(anchorsRoot.children) as HTMLElement[]).reduce(
    (anchors: HTMLElement[], anchor) =>
      anchor.children.length !== 0 && !anchor.children[0].matches('.answer-word')
        ? [...anchors, ...getPreparedAnchors(anchor as HTMLElement)]
        : [...anchors, anchor],
    []
  );

const getAnchorsCoords = (anchors: HTMLElement[], exact: number | null = null) =>
  exact !== null
    ? { x: anchors[exact].getBoundingClientRect().x, y: anchors[exact].getBoundingClientRect().y }
    : anchors.map((item) => ({
        x: item.getBoundingClientRect().x,
        y: item.getBoundingClientRect().y,
      }));
type GetShiftWordsSettings = { withDraggableElem: boolean; directionShift: 'left' | 'right' };

const getShiftedWords = (
  words: WordElementType[],
  dragId: number,
  area: 'answers' | 'pending',
  settings?: GetShiftWordsSettings
) => {
  const { withDraggableElem, directionShift } = settings ?? {
    withDraggableElem: false,
    directionShift: 'left',
  }; // default settings

  const correctWords = withDraggableElem ? words : words.filter((word) => word.wordId !== dragId);
  const elemsBeforeDraggableElem = getElemsBeforeDraggableElem(
    words,
    dragId,
    area,
    withDraggableElem
  ).map((word) => word.wordId);

  return correctWords.map((word) =>
    elemsBeforeDraggableElem.includes(word.wordId)
      ? { ...word, wordId: directionShift === 'right' ? word.wordId + 1 : word.wordId - 1 }
      : word
  );
};

const calcOriginCoords = (
  root: HTMLElement, // area из которой собираем
  area: 'answers' | 'pending',
  words: WordElementType[], // целевые слова
  dragId: number, // точка отсчета
  additionalSettings?: { includeCurrent: boolean; shiftDirection: 'right' | 'left' }
) => {
  const { includeCurrent, shiftDirection } = additionalSettings ?? {
    includeCurrent: false,
    shiftDirection: 'left',
  };
  const anchorsCoords = getAnchorsCoords(getPreparedAnchors(root)) as Coord[];
  return getElemsBeforeDraggableElem(words, dragId, area, includeCurrent).reduce(
    (originCoords, word) => ({
      ...originCoords,
      [word.wordId]: {
        x:
          anchorsCoords[shiftDirection === 'right' ? word.wordId + 1 : word.wordId - 1].x -
          anchorsCoords[word.wordId].x,
        y:
          anchorsCoords[shiftDirection === 'right' ? word.wordId + 1 : word.wordId - 1].y -
          anchorsCoords[word.wordId].y,
      },
    }),
    {}
  );
};

const getLastActiveAnchor = (anchors: AnchorElementType[]) =>
  anchors.reverse().find((word) => word.answerId !== null) as AnchorElementType;

const getUpdatedAnswersAnchors = (
  action: 'show' | 'hide' = 'show',
  anchors: AnchorElementType[],
  settings?: { target: 'last' | 'prepared' | 'hidden' }
) => {
  const { target } = settings ?? { target: 'prepared' }; // default settings
  const updatedAnswersAnchors = [...anchors];
  const targetAnchor =
    target === 'last'
      ? getLastActiveAnchor([...updatedAnswersAnchors])
      : updatedAnswersAnchors.find((anchor) =>
          target === 'prepared'
            ? anchor.isPrepared && anchor.answerId === null
            : anchor.isHidden && anchor.answerId === null
        );
  if (targetAnchor) {
    updatedAnswersAnchors.splice(targetAnchor.anchorId, 1, {
      ...targetAnchor,
      isHidden: action === 'hide',
      isPrepared: action === 'show',
      answerId: null,
    });
  }

  return updatedAnswersAnchors;
};

export {
  getElemsBeforeDraggableElem,
  getPreparedAnchors,
  getAnchorsCoords,
  getShiftedWords,
  calcOriginCoords,
  getUpdatedAnswersAnchors,
};
