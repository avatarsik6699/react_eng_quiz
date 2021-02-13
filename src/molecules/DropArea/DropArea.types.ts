import { IAnchor } from '../../atoms/Anchor/Anchor.types';
import { IWord } from '../../atoms/AnswerWord/AnswerWord.types';
import { TDragEndHandler, TDragMoveHandler, TDragStartHandler } from '../../pages/Quiz/Quiz.types';

interface IDropAreaProps {
  areaName: string;
  words: IWord[];
  anchors: IAnchor[];
  dragStartHandler: TDragStartHandler;
  dragMoveHandler: TDragMoveHandler;
  dragEndHandler: TDragEndHandler;
  originCoords: { [key: string]: { x: number; y: number } };
  isTransitioned: boolean;
  isBlockAnimaton: boolean;
}

export type { IDropAreaProps };
