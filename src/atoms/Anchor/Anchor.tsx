import React from 'react';
import { StyledAnchor } from './Anchor.styles';
import { IAnchorProps } from './Anchor.types';
const Anchor = ({ children, isHidden, isPrepared, isDataAttr, id }: IAnchorProps) => {
  return (
    <StyledAnchor
      isHidden={!!isHidden}
      isPrepared={!!isPrepared}
      data-anchor={isDataAttr ? 'waitingAnchor' : 'answerAnchor'}
      data-id={isHidden ? null : id}
    >
      {children}
    </StyledAnchor>
  );
};

export default React.memo(Anchor);
