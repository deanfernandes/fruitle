import "./App.css";
import { useState, useEffect } from "react";

const NUM_OF_GUESSES = 6;
const WORD_LEN = 5;

const fruits = [
  "MANGO",
  "GUAVA",
  "LEMON",
  "OLIVE",
  "APPLE",
  "PEARL",
  "PEACH",
  "GRAPE",
  "BERRY",
  "PRUNE",
];
const fruit = fruits[Math.floor(Math.random() * fruits.length)];

function App() {
  const [guesses, setGuesses] = useState(Array(NUM_OF_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const isGameOver = guesses.includes(fruit) || !guesses.includes(null);
  useEffect(() => {
    function handleKeyDown(event) {
      if (isGameOver) {
        return;
      }

      switch (event.key.toUpperCase()) {
        case "BACKSPACE":
        case "DELETE": {
          setCurrentGuess((c) => c.slice(0, -1));
          break;
        }
        case "ENTER": {
          if (currentGuess.length < WORD_LEN) {
            window.alert("Not enough letters");
          } else if (!fruits.includes(currentGuess)) {
            window.alert("Not in fruit list");
          } else {
            setGuesses((g) => {
              const newGuesses = [...g];
              newGuesses[g.findIndex((g) => g === null)] = currentGuess;
              return newGuesses;
            });
            setCurrentGuess("");
          }

          break;
        }
        default: {
          if (event.key.toUpperCase().match(/^[A-Z]$/) === null) {
            return;
          }

          if (currentGuess.length === WORD_LEN) {
            return;
          }

          setCurrentGuess(
            (currentGuess) => currentGuess + event.key.toUpperCase()
          );
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, isGameOver]);

  return (
    <>
      <Board guesses={guesses} currentGuess={currentGuess}></Board>
      <span id="fruit">
        {isGameOver ? (guesses.includes(fruit) ? "gz" : fruit) : null}
      </span>
    </>
  );
}

function Board({ guesses, currentGuess }) {
  return (
    <div className="board">
      {guesses.map((guess, index) => {
        if (index === guesses.findIndex((guess) => guess === null)) {
          return (
            <Line key={index} guess={currentGuess} guessLine={true}></Line>
          );
        } else {
          return <Line key={index} guess={guess} guessLine={false}></Line>;
        }
      })}
    </div>
  );
}

function Line({ guess, guessLine }) {
  const squares = [];

  for (let i = 0; i < WORD_LEN; i++) {
    let condition = "";
    if (!guessLine && guess) {
      if (fruit[i] === guess[i]) {
        condition = "correct";
      } else if (fruit.includes(guess[i])) {
        condition = "close";
      } else {
        condition = "incorrect";
      }
    }
    squares.push(
      <Square
        key={i}
        char={guess ? guess[i] : " "}
        condition={condition}
      ></Square>
    );
  }

  return <div className="line">{squares}</div>;
}

function Square({ char, condition }) {
  return <div className={"square " + condition}>{char}</div>;
}

export default App;
