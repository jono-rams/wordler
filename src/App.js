import { useEffect, useState } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import ReactConfetti from 'react-confetti';

function App() {
  const [solution, setSolution] = useState(null);
  const [winState, setWinState] = useState(null);

  useEffect(() => {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
     .then(response => response.json())
     .then(data => setSolution(data[0]))
  }, [setSolution]);

  return (
    <div className="App">
      {winState && <ReactConfetti width={window.innerWidth} height={window.innerHeight} tweenDuration={1000} /> }
      <h1>Wordler</h1>
      {solution && <Wordle solution={solution} setWinState={setWinState} /> }
    </div>
  );
}

export default App;
