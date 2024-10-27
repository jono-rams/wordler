import { useEffect, useState } from 'react';
import './App.css';
import Wordle from './components/Wordle';

function App() {
  const [solution, setSolution] = useState(null);

  useEffect(() => {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
     .then(response => response.json())
     .then(data => setSolution(data[0]))
  }, [setSolution]);

  return (
    <div className="App">
      <h1>Wordler</h1>
      {solution && <Wordle solution={solution} /> }
    </div>
  );
}

export default App;
