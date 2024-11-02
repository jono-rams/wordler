import { useState } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import ReactConfetti from 'react-confetti';

function App() {
  const [showConfetti, setShowConfetti] = useState(null);

  return (
    <div className="App">
      {showConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} tweenDuration={1000} />}
      <h1>Wordler</h1>
      <Wordle setShowConfetti={setShowConfetti} />
    </div>
  );
}

export default App;