import { useEffect, useState } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import ReactConfetti from 'react-confetti';

function App() {
  const [solution, setSolution] = useState(null);
  const [showConfetti, setShowConfetti] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWord = async () => {
      let timeoutId;
      try {
        // Promise that resolves after a timeout
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Primary API timeout'));
          }, 250);
        });
        // Race between the API call and the timeout
        const response = await Promise.race([
          fetch("https://random-word-api.herokuapp.com/word?length=5"),
          timeoutPromise,
        ]);
        clearTimeout(timeoutId); // Clear timeout if the API call finishes first
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSolution(data[0]);
      } catch (err) {
        console.error('Error fetching word from primary API:', err);
        clearTimeout(timeoutId); // Clear timeout in case of an error
        try {
          const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5");
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSolution(data[0]);
        } catch (err) {
          console.error('Error fetching word from fallback API:', err);
          setError(true);
        }
      }
    };
    fetchWord();
  }, [setSolution]);

  return (
    <div className="App">
      {showConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} tweenDuration={1000} />}
      <h1>Wordler</h1>
      {solution && <Wordle solution={solution} setShowConfetti={setShowConfetti} />}
      {error && <div>Random Word API is currently offline</div>}
    </div>
  );
}