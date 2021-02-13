interface IQuizProps {
  sentenceText: TSentenceText[];
  words: string[];
}
interface IOriginCoords {
  [key: string]: Coord;
}

type TDragStartHandler = (params: { dragId: number; from: 'waiting' | 'answers' }) => void;
type TDragMoveHandler = (params: {
  from: 'waiting' | 'answers';
  currentArea: 'out-answersArea' | 'answersArea';
}) => void;
type TDragEndHandler = (params: {
  dragId: number;
  from: 'waiting' | 'answers';
  currentArea: 'waitingArea' | 'answersArea' | 'waitingAnchor';
  originId: number;
  anchorId: number | null;
}) => void;

type TDraggableId = { originId: number; wordId: number };
type TSentenceText = { text: string; translation: string };

type Coord = { x: number; y: number };
export type { Coord, IQuizProps, TDraggableId, TDragStartHandler, TDragEndHandler, TDragMoveHandler, IOriginCoords };
