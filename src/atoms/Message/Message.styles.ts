import styled from 'styled-components';
import { IMessageTextProps, IStyledMessagepProps } from './Message.types';
const errorColor = '#ff0000';
const successColor = 'rgb(133, 238, 203)';

const StyledMessage = styled.div<IStyledMessagepProps>`
  position: relative;
  will-change: opacity;
  opacity: ${props => (props.isShow ? 1 : 0)};
  transition: opacity 2000ms ease;
  width: 50%;
`;

const MessageText = styled.span<IMessageTextProps>`
  position: absolute;
  left: 0;
  right: 0;
  position: absolute;
  text-align: center;
  font: normal normal 24px/28px Roboto, sans-serif;
  color: ${props => (props.isError ? errorColor : successColor)};
  text-shadow: -1px -2px 2px #ffffff, 1px 2px 2px rgba(91, 13, 13, 0.5);
`;

export { StyledMessage, MessageText };
