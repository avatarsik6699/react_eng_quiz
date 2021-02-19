import styled from 'styled-components';

const StyledSentence = styled.div`
  position: relative;
  max-width: 200px;
  max-height: 69px;
  padding: 12px;
  border: 2px solid #252525;
  border-radius: 10px;
`;
const SentenceTip = styled.span`
  display: inline-block;
  position: absolute;
  width: 7px;
  height: 15px;
  top: 60%;
  left: -7px;
  background: white;
  &::after {
    content: '';
    position: absolute;
    width: 20.7px;
    height: 1.5px;
    top: 6.5px;
    left: -11px;
    border-radius: 17px;
    background: black;
    transform: rotate(133deg);
  }

  &::before {
    content: '';
    position: absolute;
    height: 1.4px;
    width: 15px;
    top: 14px;
    right: 0.1px;
    border-radius: 20px;
    background: black;
  }
`;
const SentenceList = styled.ul`
  display: flex;
  flex-flow: row wrap;
  gap: 7px;
  max-height: 70px;
  margin: 0;
  padding: 2px;
  list-style-type: none;
  overflow: auto;
`;

export { SentenceList, SentenceTip, StyledSentence };
