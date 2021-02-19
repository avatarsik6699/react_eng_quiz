import styled from 'styled-components';

const StyledAnswerWord = styled.span`
  width: 70px;
  height: 30px;
  background: #ffffff;
  border: 1px solid #c9c9c9;
  box-shadow: 0px 8px 4px -6px rgba(0, 0, 0, 0.25);
  border-radius: 13px;
  display: inline-block;
  will-change: transform;
  touch-action: none;

  font: normal normal 16px/25px Roboto;
  color: #000000;
  text-align: center;
  user-select: none;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

export { StyledAnswerWord };
