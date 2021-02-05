import React from 'react';
import './Button.scss';
import { ButtonPropsType } from './Button.types';

const Button = ({ content, onclickHandler }: ButtonPropsType) => {
  return (
    <button onClick={onclickHandler} className="button">
      {content}
    </button>
  );
};

export default Button;
