import { useState } from "react";

const useWordle = () => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({}); //{a: 'green', b: 'yellow', c: 'grey'}
  const [uid, setUid] = useState(null);
  const [solution, setSolution] = useState(null);

  const getSolution = async () => {
    const response = await fetch('/solution?uid=' + uid, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    setSolution(data.solution);
  }

  const newGame = async () => {
    const response = await fetch('/new-word');
    const data = await response.json();

    return data.uid;
  };

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one turn to the turn state
  const addNewGuess = (result) => {
    if (result.every(letter => letter.color === 'green')) {
      setIsCorrect(true);
      getSolution();
    }

    setGuesses((prev) => {
      let newGuesses = [...prev];
      newGuesses[turn] = result;
      return newGuesses;
    });
    setHistory((prev) => [...prev, currentGuess]);
    setTurn((prev) => prev + 1);
    setUsedKeys((prev) => {
      let newKeys = { ...prev };

      result.forEach(letter => {
        const currentColor = newKeys[letter.key];

        if (letter.color === 'green') {
          newKeys[letter.key] = 'green';
          return;
        }
        if (letter.color === 'yellow' && currentColor !== 'green') {
          newKeys[letter.key] = 'yellow';
          return;
        }
        if (letter.color === 'grey' && (currentColor !== 'green' || currentColor !== 'yellow')) {
          newKeys[letter.key] = 'grey';
          return;
        }
      });

      return newKeys;
    });
    setCurrentGuess('');
  };

  // handle keyup event and track current guess
  // if user presses enter, add the new guess
  const handleKeyUp = ({ key }) => {
    if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    }
    else if (key === 'Enter') {
      // only add guess if turn is less than 5
      if (turn > 5) {
        console.log('You used all your guesses');
        return;
      }
      // word must be 5 characters long
      if (currentGuess.length !== 5) {
        console.log('Word must be 5 characters long');
        return;
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        console.log('You already tried that word');
        return;
      }

      console.log(uid);

      fetch('/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          guess: currentGuess
        })
      })
        .then(response => response.json())
        .then(data => addNewGuess(data.result));
    }
    else if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  };

  return { getSolution, solution, newGame, turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyUp, setUid, uid };

};

export default useWordle;