import { Word } from '../molecules/DropZone/DropZone.types';

const getElemsBeforeDraggableElem = (words: Word[], dragId: number, includeCurrent = false) =>
  words.filter((word) => (includeCurrent ? word.wordId >= dragId : word.wordId > dragId));

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

const getShiftedWords = (words: Word[], dragId: number) => {
  const wordsWithoutDraggableElem = words.filter((word) => word.wordId !== dragId);
  const elemsIdBeforeDraggableElem = getElemsBeforeDraggableElem(words, dragId).map(
    (word) => word.wordId
  );
  console.log(elemsIdBeforeDraggableElem);
  return wordsWithoutDraggableElem.map((word) =>
    elemsIdBeforeDraggableElem.includes(word.wordId) ? { ...word, wordId: word.wordId - 1 } : word
  );
};

export { getElemsBeforeDraggableElem, getPreparedAnchors, getAnchorsCoords, getShiftedWords };
