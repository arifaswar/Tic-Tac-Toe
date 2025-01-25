import { useState } from 'react';
import './App.css';

function Square({value, onSquareClick, isWinner}) {
  return (
    <button 
    className={`square ${isWinner ? 'winning-square' : ''}`}
    onClick={onSquareClick}>
      {value}
    </button> 
  );
}

function Board({squares, xIsNext, onPlay}) {
  const winnerData = calculateWinner(squares);
  const winner = winnerData?.winner;
  const winningLine = winnerData?.line || [];

  
  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  let status;
  if(winner) {
    status = winner === 'Draw' ? 'Game ended in a Draw!' : 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  };

  function isWinningSquare(index) {
    return winningLine.includes(index);
  }
  return (
    <>
    <div className="status">{status}</div>
    <div className="game-board">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            onSquareClick={() => handleClick(index)}
            isWinner={isWinningSquare(index)}
          />
        ))}
      </div>
    </>
    
  );
};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); 
  };

  function jumpTo(move) {
    setCurrentMove(move);
  };

  const moves = history.map((square, move) => {
    let description;
    if(move > 0) {
      description = 'Go move' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

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
    console.log(squares[a], squares[b], squares[c]);
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return squares.includes(null) ? null : { winner: 'Draw', line: [] };
};
