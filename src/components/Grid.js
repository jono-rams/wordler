import Row from "./Row";

/**
 * Component for rendering the Wordle game grid.
 * 
 * @param {object} props - Component props.
 * @param {string} props.currentGuess - The current word being entered by the user.
 * @param {array} props.guesses - An array of previous guesses.
 * @param {number} props.turn - The current turn number.
 * @returns {JSX.Element} The rendered game grid.
 */
export default function Grid({ currentGuess, guesses, turn }) {
  // Render the grid rows
  return (
    <div>
      {guesses.map((guess, index) => {
        // If the current row matches the current turn, render it with the currentGuess prop
        if (turn === index) {
          return <Row key={index} currentGuess={currentGuess} />
        }
        // Otherwise, render the row with the guess prop
        return <Row key={index} guess={guess} />
      })}
    </div>
  )
}