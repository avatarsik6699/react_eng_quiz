interface IAnchorProps {
  children?: React.ReactNode;
  isHidden?: boolean;
  isPrepared?: boolean;
  isDataAttr: boolean;
  id: number;
}

interface IStyledAnchorProps {
  isHidden: boolean;
  isPrepared: boolean;
}

type IAnchor = {
  anchorId: number;
  answerId: null | number;
  isHidden: boolean;
  isPrepared: boolean;
};

export type { IAnchorProps, IAnchor, IStyledAnchorProps };
