interface AnchorPropsType {
  children?: React.ReactNode;
  isHidden?: boolean;
  isPrepared?: boolean;
  isdisappear: boolean;
}

type Anchor = {
  anchorId: number;
  answerId: null | number;
  isHidden: boolean;
  isPrepared: boolean;
  isdisappear: boolean;
};

export type { Anchor, AnchorPropsType };
