import React from 'react';
import './App.scss';
import Quiz from './pages/Quiz/Quiz';
import db from './db';

const { sentenceWords, answersWords } = db.q1;
const App = () => {
  return (
    <div className="App">
      <Quiz sentenceText={sentenceWords} words={answersWords} />
    </div>
  );
};

export default App;
