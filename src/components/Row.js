/**
 * Component for rendering a single row in the Wordle game grid.
 *
 * @param {object} props - Component props.
 * @param {array} props.guess - An array of letter objects representing a guess (if available).
 * @param {string} props.currentGuess - The current word being entered by the user (if available).
 * @returns {JSX.Element} The rendered row.
 */
export default function Row({ guess, currentGuess }) {
  
  // If a guess is provided, render the row with colored letters
  if (guess) {
    return (
      <div className='row'>
        {guess.map((letter, index) => (
          <div key={index} className={letter.color}>{letter.key}</div>
        ))}
      </div>
    )
  }

   // If currentGuess is provided, render the row with the current letters
  if (currentGuess) {
    let letters = currentGuess.split('');

    return (
      <div className="row current">
        {letters.map((letter, index) => (
          <div key={index + letter} className='filled'>{letter}</div>
        ))}
        {/* Render empty boxes for the remaining letters */}
        {[...Array(5- letters.length)].map((_, i) => (<div key={i}></div>))}
      </div>
    )
  }
  
  // If neither guess nor currentGuess is provided, render an empty row
  return (
    <div className='row'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}