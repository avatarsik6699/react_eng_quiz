import styled from 'styled-components';

const StyledQuiz = styled.div`
  max-width: 472px;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 0px 0px 30px 0;
`;
const QuizInfo = styled.div`
  margin-bottom: 20px;
  display: flex;
`;
const QuizAnswersWrapper = styled.div`
  margin-bottom: 50px;
`;

const QuizWaitingWrapper = styled.div`
  margin-bottom: 25px;
`;

const QuizButtonWrapper = styled.div`
  max-width: 320px;
  width: 100%;
`;
export { StyledQuiz, QuizInfo, QuizAnswersWrapper, QuizWaitingWrapper, QuizButtonWrapper };
