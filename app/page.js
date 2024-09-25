"use client"
import { useState } from 'react';
import styles from './page.module.css';


function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`${styles.square} ${highlight ? styles.winningSquare : ''}`} // Highlight winning squares
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const { winner, winningSquares } = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className={styles.gameBoardContainer}>
      <h1>Tic-Tac-Toe</h1>
      <div className={`${styles.status} ${winner ? styles.winnerText : ''}`}>{status}</div>
      <div className={styles.gameBoard}>
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            highlight={winningSquares.includes(i)} // Highlight winning squares
          />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li className={styles.historyItem} key={move}>
        <button className={styles.historyButton} onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className={styles.game}>
      <div className={styles.gameBoardContainer}>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className={styles.gameInfo}>
        <ol className={styles.olelement} >{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] }; // Return winner and winning line
    }
  }
  return { winner: null, winningSquares: [] }; // No winner yet
}
