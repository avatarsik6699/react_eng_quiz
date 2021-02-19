import React from 'react';
import { MessageText, StyledMessage } from './Message.styles';
import { IMessageProps } from './Message.types';

const Message = ({ content, isError }: IMessageProps) => {
  const isShow = content ? true : false;
  return (
    <StyledMessage isShow={isShow}>
      <MessageText isError={isError}>{content}</MessageText>
    </StyledMessage>
  );
};

export default Message;
