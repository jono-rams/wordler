import { useState } from "react";

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({}); //{a: 'green', b: 'yellow', c: 'grey'}

  // format a guess into an array of letter objects
  // e.g. [{key: 'a', color: 'yellow}]
  const formatGuess = () => {
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map(letter => {
      return { key: letter, color: 'grey'};
    });

    // find any green letters
    formattedGuess.forEach((letter, index) => {
      if (solutionArray[index] === letter.key) {
        formattedGuess[index].color = 'green';
        solutionArray[index] = null;
      }
    });

    // find any yellow letters
    formattedGuess.forEach((letter, index) => {
      if (solutionArray.includes(letter.key) && letter.color !== 'green') {
        formattedGuess[index].color = 'yellow';
        solutionArray[solutionArray.indexOf(letter.key)] = null;
      }
    });

    return formattedGuess;
  };

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one turn to the turn state
  const addNewGuess = (formattedGuess) => {
    if(currentGuess === solution) {
      setIsCorrect(true);
    }
    setGuesses((prev) => {
      let newGuesses = [...prev];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prev) => [...prev, currentGuess]);
    setTurn((prev) => prev + 1);
    setUsedKeys((prev) => {
      let newKeys = {...prev};

      formattedGuess.forEach(letter => {
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
      
      const formatted = formatGuess();
      addNewGuess(formatted);
    }
    else if (/^[A-Za-z]$/.test(key)) {
      if(currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  };

  return {turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyUp};

}

export default useWordle;