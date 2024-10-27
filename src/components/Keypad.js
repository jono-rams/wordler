import { useEffect, useState } from "react";

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

export default function Keypad({ handleKeyUp }) {
  const [letters, setLetters] = useState(null);

  useEffect(() => {
    setLetters(lettersArray);
  }, []);

  return (
    <div className="keypad">
      {letters && letters.map((letter) => {
        return (
          <button key={letter.key} onClick={() => handleKeyUp({key: letter.key})}>
            {letter.key}
          </button>
        );
      })}
    </div>
  )
}