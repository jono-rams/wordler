import { useEffect } from "react";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";

export default function Wordle({ solution, setWinState }) {
  const { currentGuess, handleKeyUp, guesses, isCorrect, turn, usedKeys } = useWordle(solution);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    if (isCorrect) {
      window.removeEventListener('keyup', handleKeyUp);
      setWinState(true);
    }
    if (turn > 5) {
      window.removeEventListener('keyup', handleKeyUp);
    }

    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [handleKeyUp, isCorrect, setWinState, turn]);

  return (
    <div>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
      <Keypad handleKeyUp={handleKeyUp} usedKeys={usedKeys} isCorrect={isCorrect} />
    </div>
  )
}