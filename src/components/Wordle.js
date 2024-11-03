import { useEffect, useState, useRef } from "react";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";

export default function Wordle({ setShowConfetti }) {
  const { currentGuess, handleKeyUp, guesses, isCorrect, turn, usedKeys, solution, newGame, uid, setUid, getSolution } = useWordle();
  const [showModal, setShowModal] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);
  const startNew = useRef(newGame);

  useEffect(() => {
    if (uid) { return; }
    startNew.current()
      .then(uid => setUid(uid));
  }, [uid, setUid]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    if (isCorrect) {
      if (confettiShown === false) {
        setConfettiShown(true);
        setShowConfetti(true);
      }
      setTimeout(() => {
        setShowModal(true);
      }, 2500);
      window.removeEventListener('keyup', handleKeyUp);
    }
    if (turn > 5) {
      if (!solution && !isCorrect) {
        getSolution().then(() => {
          setTimeout(() => setShowModal(true), 2000);
          window.removeEventListener('keyup', handleKeyUp);
        });
      }
    }

    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [handleKeyUp, isCorrect, setShowConfetti, turn, confettiShown, getSolution, solution]);

  return (
    <div>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
      <Keypad handleKeyUp={handleKeyUp} usedKeys={usedKeys} isCorrect={isCorrect} />
      {solution && showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution} />}
    </div>
  );
}