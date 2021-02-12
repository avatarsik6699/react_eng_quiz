import React from 'react';
import './Button.scss';
import { ButtonPropsType } from './Button.types';

const Button = ({ content, onclickHandler, isTranslate }: ButtonPropsType) => {
  const cls = ['button'];
  if (isTranslate) cls.push('move');
  return (
    <button onClick={onclickHandler} className={cls.join(' ')}>
      {content}
    </button>
  );
};

export default Button;
