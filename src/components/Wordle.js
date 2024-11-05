import { useEffect, useState, useRef } from "react";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";

/**
 * The main Wordle game component.
 * 
 * @param {object} props - Component props.
 * @param {function} props.setShowConfetti - Function to trigger confetti animation.
 * @returns {JSX.Element} The rendered Wordle game component.
 */
export default function Wordle({ setShowConfetti }) {
  // Initialize state variables from the useWordle hook
  const { currentGuess, handleKeyUp, guesses, isCorrect, turn, usedKeys, solution, newGame, uid, setUid } = useWordle();
  /**
   * State variable to control the visibility of the modal.
   * @type {boolean}
   */
  const [showModal, setShowModal] = useState(false);
  /**
   * State variable to control the visibility of the confetti animation.
   * @type {boolean}
   */
  const [confettiShown, setConfettiShown] = useState(false);
  /**
   * Ref to store the newGame function from the useWordle hook to prevent unnecessary re-renders.
   * @type {object}
   */
  const startNew = useRef(newGame);

  // useEffect hook to start a new game when the component mounts
  useEffect(() => {
    // If a game is already in progress (uid exists), do nothing
    if (uid) { return; }
    // Otherwise, start a new game and set the uid
    startNew.current()
      .then(uid => setUid(uid));
  }, [uid, setUid]);

  // useEffect hook to handle game logic and keyboard events
  useEffect(() => {
    // Add event listener for key presses
    window.addEventListener('keyup', handleKeyUp);

    // If the user guesses correctly
    if (isCorrect) {
      // Show confetti if it hasn't been shown yet
      if (confettiShown === false) {
        setConfettiShown(true);
        setShowConfetti(true);
      }
      // Show the modal after a delay
      setTimeout(() => {
        setShowModal(true);
      }, 2500);
      // Remove the event listener to prevent further input
      window.removeEventListener('keyup', handleKeyUp);
    }

    // If the user has used all their turns
    if (turn > 5) {
      // Show the modal after a delay
      setTimeout(() => {
        setShowModal(true);
      }, 2500);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [handleKeyUp, isCorrect, setShowConfetti, turn, confettiShown]);

  // Render the game components
  return (
    <div>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
      <Keypad handleKeyUp={handleKeyUp} usedKeys={usedKeys} isCorrect={isCorrect} />
      {solution && showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution} />}
    </div>
  );
}