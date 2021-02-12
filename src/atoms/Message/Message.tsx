import React from 'react';
import './Message.scss';
import { IMessageProps } from './Message.types';

const Message = ({ content, isError }: IMessageProps) => {
  const messageCls = [];
  const textCls = [];
  if (content) messageCls.push('message_show');
  if (isError) textCls.push('message__text_wrong');
  return (
    <div className={`message ${messageCls.join(' ')}`}>
      <span className={`message__text ${textCls.join(' ')}`}>{content}</span>
    </div>
  );
};

export default Message;
