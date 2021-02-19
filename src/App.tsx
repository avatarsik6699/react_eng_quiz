import React from 'react';
import './App.scss';
import Quiz from './pages/Quiz/Quiz';
const App = () => {
  return (
    <div className="App">
      {/* quizId will be taken from url  */}
      <Quiz quizId={'q1'} />
    </div>
  );
};

export default App;
