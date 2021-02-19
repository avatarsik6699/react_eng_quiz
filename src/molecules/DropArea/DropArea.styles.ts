import styled from 'styled-components';

const StyledDropArea = styled.div`
  display: flex;
  flex-flow: row wrap;
  max-width: 470px;

  &[data-dropname='waitingArea'] {
    gap: 10px;
    padding: 0;
    margin: 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 1;
  gap: 10px;
  border-top: 2px solid #cecccc;
  padding: 10px 0px;
  margin: 0;
  list-style-type: none;

  &:last-child {
    justify-content: flex-start;
    border-bottom: 2px solid #cecccc;
  }
`;

export { Wrapper, StyledDropArea };
