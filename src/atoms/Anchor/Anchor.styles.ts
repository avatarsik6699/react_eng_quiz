import styled from 'styled-components';
import { IStyledAnchorProps } from './Anchor.types';
const preparedColor = 'rgba(224, 224, 224, 0.452)';
const showColor = '#ececec';

const StyledAnchor = styled.li<IStyledAnchorProps>`
  will-change: background-color;
  transition: opacity 200ms ease, background-color 200ms ease;
  opacity: 1;
  width: 70px;
  height: 30px;
  border-radius: 13px;
  display: inline-block;
  background: ${props => !props.isHidden && showColor};
  background: ${props => props.isPrepared && preparedColor};
  box-shadow: ${props => !props.isHidden && 'inset 0px 8px 4px -6px rgba(0, 0, 0, 0.25)'};
`;

export { StyledAnchor };
