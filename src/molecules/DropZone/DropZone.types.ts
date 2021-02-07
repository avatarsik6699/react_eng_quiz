interface DropZonePropsType {
  dropName: string;
  words: Word[];
  anchors: Anchor[];
  dragStartHandler: any;
  dragMoveHandler: any;
  dragEndHandler: any;
  originCoords: any;
  link: any;
  isTransitioned: boolean;
}

type Word = {
  text: string;
  wordId: number;
  originId: number;
};

interface Anchor {
  anchorId: number;
  answerId?: number | null;
  isHidden: boolean;
  isPrepared: boolean;
}

export type { Word, DropZonePropsType };
