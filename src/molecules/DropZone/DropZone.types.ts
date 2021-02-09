import { AnchorElementType } from '../../atoms/Anchor/Anchor.types';
import { WordElementType } from '../../atoms/AnswerWord/AnswerWord.types';

interface DropZonePropsType {
  dropName: string;
  words: WordElementType[];
  anchors: AnchorElementType[];
  dragStartHandler: any;
  dragMoveHandler: any;
  dragEndHandler: any;
  originCoords: { [key: string]: { x: number; y: number } };
  link: any;
  isTransitioned: boolean;
  isBlockAnimaton: boolean;
}

export type { DropZonePropsType };
