import React from 'react';
import './ErrorMessage.scss';
import { ErrorMessagePropsType } from './ErrorMessage.types';

const ErrorMessage = ({ content }: ErrorMessagePropsType) => {
  return (
    <div className="error-message">
      <span className="error-message__text">{content}</span>
    </div>
  );
};

export default ErrorMessage;
