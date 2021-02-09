interface AnchorPropsType {
  children?: React.ReactNode;
  isHidden?: boolean;
  isPrepared?: boolean;
  isdisappear: boolean;
  isDataAttr: boolean;
  id: number;
}

type AnchorElementType = {
  anchorId: number;
  answerId: null | number;
  isHidden: boolean;
  isPrepared: boolean;
  isdisappear: boolean;
};

export type { AnchorPropsType, AnchorElementType };
