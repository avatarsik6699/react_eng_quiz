import React from 'react';
import StyledApp from './App.styles';
import Quiz from './pages/Quiz/Quiz';
const App = () => {
  return (
    <StyledApp className="App">
      <Quiz quizId={'q1'} />
    </StyledApp>
  );
};

export default App;
