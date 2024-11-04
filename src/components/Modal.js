/**
 * Component for rendering the Wordle game modal.
 * 
 * @param {object} props - Component props.
 * @param {boolean} props.isCorrect - Indicates if the user guessed correctly.
 * @param {number} props.turn - The number of turns taken to guess.
 * @param {string} props.solution - The solution word.
 * @returns {JSX.Element} The rendered modal.
 */
export default function Modal({ isCorrect, turn, solution }) {
  // Render the modal content
  return (
    <div className="modal">
      {/* If the user guessed correctly, show the winning message */}
      {isCorrect ? (
        <div>
          <h1>You Win!</h1>
          <p className="solution">{solution}</p>
          <p>You found the solution in {turn} guesses :{')'}</p>
          <button onClick={() => window.location.reload()}>Play Again?</button> {/* Reload the page to start a new game */}
        </div>
      ) : (
        // Otherwise, show the losing message
        <div>
          <h1>Nevermind!</h1>
          <p className="solution">{solution}</p>
          <p>Better luck next time :{')'}</p>
          <button onClick={() => window.location.reload()}>Play Again?</button> {/* Reload the page to start a new game */}
        </div>
      )}
    </div>
  )
}