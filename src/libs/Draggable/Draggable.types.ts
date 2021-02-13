import { IWord } from '../../atoms/AnswerWord/AnswerWord.types';
import { TDragEndHandler, TDragMoveHandler, TDragStartHandler } from '../../pages/Quiz/Quiz.types';

interface DraggablePropsType {
  children: React.ReactElement;
  draggableElemInfo: IWord;
  isTransitioned: boolean;
  isBlockAnimaton: boolean;
  originCoords: { x: number; y: number };
  dragStartHandler: TDragStartHandler;
  dragMoveHandler: TDragMoveHandler;
  dragEndHandler: TDragEndHandler;
}

type InitTranslateCoords = {
  x: number;
  y: number;
};

type GetBellowElement = (target: HTMLElement, x: number, y: number) => HTMLElement | null;

export type { DraggablePropsType, InitTranslateCoords, GetBellowElement };
