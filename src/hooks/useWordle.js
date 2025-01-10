import { useState } from "react";

/**
 * Custom React hook for managing the state and logic of a Wordle game.
 * 
 * @returns {object} An object containing the game state and functions.
 */
const useWordle = () => {
  // State variables to track game progress and data

  /**
   * The current turn number (0-5).
   * @type {number}
   */
  const [turn, setTurn] = useState(0);

  /**
   * The current word being entered by the user.
   * @type {string}
   */
  const [currentGuess, setCurrentGuess] = useState('');

  /**
   * An array holding the results of each guess (up to 6 guesses).
   * @type {array}
   */
  const [guesses, setGuesses] = useState([...Array(6)]);

  /**
   * An array storing all previous guesses.
   * @type {array}
   */
  const [history, setHistory] = useState([]);

  /**
  * A boolean indicating if the user has guessed the correct word.
  * @type {boolean}
  */
  const [isCorrect, setIsCorrect] = useState(false);

  /**
   * An object tracking the status of each key on the keyboard.
   * Green for correct, yellow for present, grey for absent.
   * @type {object}
   */
  const [usedKeys, setUsedKeys] = useState({});

  /**
   * A unique identifier for the current game.
   * @type {string}
   */
  const [uid, setUid] = useState(null);

  /**
   * The solution word for the current game.
   * @type {string}
   */
  const [solution, setSolution] = useState(null);

  /**
   * A boolean indicating if the game is loading.
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * An error message to display to the user.
   * @type {string}
   */
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Fetches the solution for the current game from the API.
   */
  const getSolution = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://wordle-api.rampersad-jonathan.workers.dev/api/solution?uid=' +
        uid,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSolution(data.solution);
    }
    catch (err) {
      setErrorMessage("Error fetching solution");
    }
    finally {
      setIsLoading(false);
    }
  };

  /**
   * Starts a new game by fetching a new word and uid from the API.
   * @returns {string} The uid for the new game.
   */
  const newGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://wordle-api.rampersad-jonathan.workers.dev/api/new-word');
      const data = await response.json();
      return data.uid;
    }
    catch (err) {
      setErrorMessage("Error starting new game. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates the game state after each guess.
   * 
   * @param {array} result: An array of objects representing the result of the guess.
   */
  const addNewGuess = (result) => {
    if (result.every(letter => letter.color === 'green')) {
      setIsCorrect(true);
      getSolution();
    }
    else if (turn === 5) {
      if (!solution) {
        getSolution();
      }
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
        if (letter.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
          newKeys[letter.key] = 'grey';
          return;
        }
      });
      return newKeys;
    });
    setCurrentGuess('');
  };

  /**
   * Handles the keyup event and updates the current guess.
   * 
   * @param {object} event: The keyup event object.
   */
  const handleKeyUp = ({ key }) => {
    setErrorMessage(null);

    if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    }
    else if (key === 'Enter') {
      // only add guess if turn is less than 5
      if (turn > 5) {
        setErrorMessage('You used all your guesses');
        return;
      }
      // word must be 5 characters long
      if (currentGuess.length !== 5) {
        setErrorMessage('Word must be 5 characters long');
        return;
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        setErrorMessage('You already tried that word');
        return;
      }

      setIsLoading(true);
      fetch('https://wordle-api.rampersad-jonathan.workers.dev/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          guess: currentGuess
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => addNewGuess(data.result))
        .catch(err => setErrorMessage("Error fetching guess result:" + err))
        .finally(() => setIsLoading(false));
    }
    else if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  };

  // Return an object with all the state variables and functions
  return {
    solution,
    newGame,
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    handleKeyUp,
    setUid,
    uid,
    isLoading,
    errorMessage
  };
};

export default useWordle;
