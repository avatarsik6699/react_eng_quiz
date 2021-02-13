import React from 'react';
import './Button.scss';
import { IButtonProps } from './Button.types';

const Button = ({ content, onclickHandler, isTranslate }: IButtonProps) => {
  const cls = ['button'];
  if (isTranslate) cls.push('button_moved');
  return (
    <button onClick={onclickHandler} className={cls.join(' ')}>
      {content}
    </button>
  );
};

export default Button;
