import { useState } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import ReactConfetti from 'react-confetti';

/**
 * Main App component for the Wordle game.
 * 
 * @returns {JSX.Element} The rendered application.
 */
function App() {
  /**
   * State variable to control the visibility of the confetti.
   * @type {boolean}
   */
  const [showConfetti, setShowConfetti] = useState(null);

  // Render the app content
  return (
    <div className="App">
      {/* Conditionally render confetti when showConfetti is true */}
      {showConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} tweenDuration={1000} />}
      <h1>Wordler</h1>
      <Wordle setShowConfetti={setShowConfetti} />
    </div>
  );
}

export default App;
