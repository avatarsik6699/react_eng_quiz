import React from 'react';
import StyledButton from './Button.styles';
import { IButtonProps } from './Button.types';

const Button = ({ content, onclickHandler, isMove }: IButtonProps) => {
  return (
    <StyledButton onClick={onclickHandler} isMove={isMove}>
      {content}
    </StyledButton>
  );
};

export default Button;
