"use client";

import { useState } from 'react';
import axios from 'axios';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChessBoard = () => {
  const [chess] = useState(new Chess());
  const [difficulty, setDifficulty] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [fen, setFen] = useState<string>(chess.fen());
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [showValidMoves, setShowValidMoves] = useState<boolean>(false);
  const [showRestartPrompt, setShowRestartPrompt] = useState<boolean>(false);

  const startGame = async () => {
    try {
      const response = await axios.post('http://localhost:8080/chess/start');
      setMessage(response.data);
      chess.reset();
      setFen(chess.fen());
      setValidMoves([]);
    } catch (error) {
      console.error('Error starting the game:', error);
    }
  };

  const handleShowValidMoves = () => {
    setShowValidMoves((prev) => !prev);
  };

  const handleRestartGame = () => {
    setShowRestartPrompt(false);
    startGame(); // Restart the game
  };

  const makeMove = async (move: { from: string; to: string }) => {
    const result = chess.move(move);
    if (result) {
      setFen(chess.fen());
      setValidMoves([]);

      if (chess.isCheckmate()) {
        toast.success('Checkmate! You win!');
        setShowRestartPrompt(true); // Show restart prompt
        return;
      } else if (chess.isDraw()) {
        toast.info('Game is a draw!');
        setShowRestartPrompt(true); // Show restart prompt for draw
        return;
      }

      setTimeout(async () => {
        try {
          const response = await axios.post('http://localhost:8080/chess/move', { fen: chess.fen() });
          setMessage(`Best move: ${response.data}`);
          chess.move(response.data);
          setFen(chess.fen());

          if (chess.isCheckmate()) {
            toast.error('Checkmate! You lose!');
            setShowRestartPrompt(true); // Show restart prompt
          } else if (chess.isDraw()) {
            toast.info('Game is a draw!');
            setShowRestartPrompt(true); // Show restart prompt for draw
          }
        } catch (error) {
          console.error("Error making Stockfish's move:", error);
        }
      }, 1000);
    } else {
      toast.error('Invalid move!'); // Show the error toast for invalid moves
      console.log('Invalid move:', move);
    }
  };

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      const move = { from: selectedSquare, to: square };
      makeMove(move);
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true }) as Array<{ to: string }>;
      const validMoveSquares = moves.map((move) => move.to);
      setValidMoves(validMoveSquares);
    }
  };

  const setDifficultyLevel = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = parseInt(e.target.value, 10);
    setDifficulty(level);
    try {
      await axios.post('http://localhost:8080/chess/difficulty', level);
      setMessage(`Difficulty set to ${level}`);
    } catch (error) {
      console.error('Error setting difficulty:', error);
    }
  };

  const quitGame = async () => {
    try {
      const response = await axios.post('http://localhost:8080/chess/quit');
      setMessage(response.data);
    } catch (error) {
      console.error('Error quitting the game:', error);
    }
  };

  return (
    <div>
      <div className='flex gap-10 align-middle justify-center'>
      <div className='flex flex-col gap-6 align-middle justify-center'>
      <h1>Chess Game</h1>
      <div>
        <button onClick={() => toast.success('This is a test toast!')}>Test Toast</button>
        <button onClick={startGame}>Start Game</button>
        <button onClick={quitGame}>Quit Game</button>
        <button onClick={handleShowValidMoves}> {showValidMoves ? "Hide Moves" : "Show Moves"} </button>
      </div>
      <div>
        <label htmlFor="difficulty">Set Difficulty:</label>
        <select id="difficulty" value={difficulty} onChange={setDifficultyLevel}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <p>{message}</p>
      </div>
      <div style={{
        width: '40rem', height: '40rem'
      }}>
        <Chessboard
          position={fen}
          onSquareClick={handleSquareClick}
          customSquareStyles={showValidMoves
            ? validMoves.reduce(
                (acc, square) => ({ ...acc, [square]: { background: 'rgba(0, 255, 0, 0.4)' } }),
                {}
              )
            : {}
          }
        />
      </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {showRestartPrompt && (
        <div className="restart-prompt">
          <p>The game is over. Would you like to restart?</p>
          <button onClick={handleRestartGame}>Yes</button>
          <button onClick={() => setShowRestartPrompt(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
