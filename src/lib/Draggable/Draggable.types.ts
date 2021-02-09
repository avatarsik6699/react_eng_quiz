interface DraggablePropsType {
  children: React.ReactElement;
  draggableElemInfo: any;
  isTransitioned: boolean;
  isBlockAnimaton: boolean;
  originCoords: any;
  dragStartHandler: any;
  dragMoveHandler: any;
  dragEndHandler: any;
}

type InitTranslateCoords = {
  x: number;
  y: number;
};

type GetBellowElement = (target: HTMLElement, x: number, y: number) => HTMLElement;

export type { DraggablePropsType, InitTranslateCoords, GetBellowElement };
