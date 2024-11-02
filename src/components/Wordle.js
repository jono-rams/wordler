import { useEffect, useState } from "react";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";

export default function Wordle({ solution, setShowConfetti }) {
  const { currentGuess, handleKeyUp, guesses, isCorrect, turn, usedKeys } = useWordle(solution);
  const [showModal, setShowModal] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    if (isCorrect) {
      if (confettiShown === false) {
        setConfettiShown(true);
        setShowConfetti(true);
      }
      setTimeout(() => {
        setShowModal(true);
      }, 2500)
      window.removeEventListener('keyup', handleKeyUp);
    }
    if (turn > 5) {
      setTimeout(() => setShowModal(true), 2000)
      window.removeEventListener('keyup', handleKeyUp);
    }

    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [handleKeyUp, isCorrect, setShowConfetti, turn, confettiShown]);

  return (
    <div>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
      <Keypad handleKeyUp={handleKeyUp} usedKeys={usedKeys} isCorrect={isCorrect} />
      {showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution} />}
    </div>
  )
}