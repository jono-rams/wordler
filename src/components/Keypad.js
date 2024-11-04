import { useEffect, useState } from "react";

// Array of letter objects for the keypad
const lettersArray = [
    {"key": "a"},
    {"key": "b"},
    {"key": "c"},
    {"key": "d"},
    {"key": "e"},
    {"key": "f"},
    {"key": "g"},
    {"key": "h"},
    {"key": "i"},
    {"key": "j"},
    {"key": "k"},
    {"key": "l"},
    {"key": "m"},
    {"key": "n"},
    {"key": "o"},
    {"key": "p"},
    {"key": "q"},
    {"key": "r"},
    {"key": "s"},
    {"key": "t"},
    {"key": "u"},
    {"key": "v"},
    {"key": "w"},
    {"key": "x"},
    {"key": "y"},
    {"key": "z"}
  ]

  /**
 * Component for rendering the Wordle game keypad.
 * 
 * @param {object} props - Component props.
 * @param {function} props.handleKeyUp - Function to handle key presses.
 * @param {object} props.usedKeys - An object tracking the status of used keys.
 * @param {boolean} props.isCorrect - Indicates if the user has guessed correctly.
 * @returns {JSX.Element} The rendered keypad.
 */
export default function Keypad({ handleKeyUp, usedKeys, isCorrect }) {
  /**
   * State variable to store the letters for the keypad.
   * @type {array}
   */
  const [letters, setLetters] = useState(null);

  // useEffect hook to initialize the letters state
  useEffect(() => {
    setLetters(lettersArray);
  }, []);

  // Render the keypad buttons
  return (
    <div className="keypad">
      {letters && letters.map((letter) => {
        // Determine the color class for the button based on usedKeys
        const color = usedKeys[letter.key];
        return (
          // Render a button for each letter
          <button 
            className={color} 
            disabled={color === 'grey' || isCorrect} // Disable button if the letter is greyed out or the answer is correct
            key={letter.key} 
            onClick={() => handleKeyUp({key: letter.key})} // Call handleKeyUp when the button is clicked
          >
            {letter.key}
          </button>
        );
      })}
    </div>
  )
}