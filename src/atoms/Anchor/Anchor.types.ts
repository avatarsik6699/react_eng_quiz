interface AnchorPropsType {
  children?: React.ReactNode;
  isHidden?: boolean;
  isPrepared?: boolean;
}

type Anchor = {
  anchorId: number;
  answerId: null | number;
  isHidden: boolean;
  isPrepared: boolean;
};

export type { Anchor, AnchorPropsType };
